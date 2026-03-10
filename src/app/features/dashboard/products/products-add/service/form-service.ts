import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { product } from '../../interface/product-interface';
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';

@Injectable({
  providedIn: 'root',
})
export class FormService implements HasUnsavedChanges {

  editing = signal(false);
  editingId = signal('');

  fB = inject(FormBuilder);

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

  constructor() { }

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
}
