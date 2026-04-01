import { DestroyRef, inject, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { product } from '../../interface/product-interface';
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService implements HasUnsavedChanges {

  editing = signal(false);
  editingId = signal('');

  private readonly formKey: string = 'product_form';


  private fB = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);



  productForm: FormGroup = this.fB.group({
    status: [false],
    basic_info: this.fB.group({
      product_name: [null, Validators.required],
      product_category: [null, Validators.required],
      product_price: [null, Validators.required],
      product_company: [null, Validators.required],
    }),
    detail_info: this.fB.group({
      product_expiry: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      product_regno: [null, Validators.required],
      product_mfg: [null, Validators.required],
      product_stock: [null, Validators.required],
    }),
  });

  constructor() {
    // Add this AFTER form initialization
    this.productForm.valueChanges
      .pipe(
        debounceTime(500),              // wait 500ms after user stops typing
        takeUntilDestroyed(this.destroyRef),  // auto cleanup on destroy
        filter(() => this.productForm.dirty)  // 👈 only save when user actually changed something
      )
      .subscribe(val => {
        this.saveFormToStorage(val);
      });
  }

  patchForNewEntry(formdata: product) {
    this.productForm.patchValue({
      status: formdata.status,
      basic_info: {
        product_name: formdata.basic_info.product_name,
        product_category: formdata.basic_info.product_category,
        product_price: formdata.basic_info.product_price,
        product_company: formdata.basic_info.product_company,
      },
      detail_info: {
        product_expiry: formdata.detail_info.product_expiry,
        product_regno: formdata.detail_info.product_regno,
        product_mfg: formdata.detail_info.product_mfg,
        product_stock: formdata.detail_info.product_stock,
      }
    });
    this.productForm.markAsPristine();
  }
  patchFormData(formdata: product) {
    this.editingId.set(formdata.id);
    this.editing.set(true);
    this.productForm.patchValue({
      status: formdata.status,
      basic_info: {
        product_name: formdata.basic_info.product_name,
        product_category: formdata.basic_info.product_category,
        product_price: formdata.basic_info.product_price,
        product_company: formdata.basic_info.product_company,
      },
      detail_info: {
        product_expiry: formdata.detail_info.product_expiry,
        product_regno: formdata.detail_info.product_regno,
        product_mfg: formdata.detail_info.product_mfg,
        product_stock: formdata.detail_info.product_stock,
      }
    });
    this.productForm.markAsPristine();
  }

  getForm(): FormGroup {
    return this.productForm;
  }

  // ✅ Reset by clearing values — same FormGroup instance is kept
  resetForm() {
    this.productForm.reset({ status: false });
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
    this.clearFormFromStorage();
    this.editing.set(false);
    this.editingId.set('');
  }

  // ✅ Call this after successful submit — disables both guards
  markClean() {
    this.productForm.markAsPristine();
  }

  hasUnsavedChanges(): boolean {
    return this.productForm.dirty;
  }

  isValid(): boolean {
    return this.productForm.valid;
  }

  // 1. Call this whenever form value changes (in your component after every valueChanges)
  saveFormToStorage(formValue: any): void {
    localStorage.setItem(this.formKey, JSON.stringify(formValue));
  }

  // 2. Call this on successful submit or cancel
  clearFormFromStorage(): void {
    localStorage.removeItem(this.formKey);
  }

  // 3. Call this to check if draft exists
  hasSavedForm(): boolean {
    return !!localStorage.getItem(this.formKey);
  }

  // 4. Call this to get the saved form value
  getSavedForm(): any {
    const form = localStorage.getItem(this.formKey);
    return form ? JSON.parse(form) : null;
  }

  // Add this method to both FormService and Formservice
  restoreDraft(formValue: any): void {
    this.productForm.patchValue(formValue); // use productForm in FormService
    // deliberately does NOT set editing or editingId
  }
}
