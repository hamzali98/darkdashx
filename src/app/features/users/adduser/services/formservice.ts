import { DestroyRef, Injectable, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../interface/user';
import { customEmailValidator } from '@app/shared/validators/email-validator';
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Formservice implements HasUnsavedChanges {

  editing = signal(false);
  editingId = signal('');

  private readonly formKey: string = 'user_form';

  private fB = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  userForm: FormGroup = this.fB.group({
    status: [false],
    personal_info: this.fB.group({
      user_name: [null, Validators.required],
      user_email: [null, [Validators.required, customEmailValidator]],
      user_photo: [null],
      user_desc: [null, Validators.required],
    }),
    basic_info: this.fB.group({
      user_phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      user_position: [null, Validators.required],
      user_location: [null, Validators.required],
      user_website: [null, [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)]],
    }),
    team_info: this.fB.group({
      team_name: [null, Validators.required],
      team_rank: [null, Validators.required],
      team_office: [null, Validators.required],
      team_mail: [null, [Validators.required, customEmailValidator]],
    }),
  })

  constructor() {
    // Add this AFTER form initialization
    this.userForm.valueChanges
      .pipe(
        debounceTime(500),              // wait 500ms after user stops typing
        takeUntilDestroyed(this.destroyRef),  // auto cleanup on destroy
        filter(() => this.userForm.dirty)  // 👈 only save when user actually changed something
      )
      .subscribe(val => {
        this.saveFormToStorage(val);
      });
  }

  patchFormData(formdata: User) {
    this.editing.set(true);
    this.editingId.set(formdata.id);
    this.userForm.patchValue({
      status: formdata.status,
      personal_info: {
        user_name: formdata.personal_info.user_name,
        user_email: formdata.personal_info.user_email,
        user_photo: formdata.personal_info.user_photo,
        user_desc: formdata.personal_info.user_desc,
      },
      basic_info: {
        user_phone: formdata.basic_info.user_phone,
        user_position: formdata.basic_info.user_position,
        user_location: formdata.basic_info.user_location,
        user_website: formdata.basic_info.user_website,
      },
      team_info: {
        team_name: formdata.team_info.team_name,
        team_rank: formdata.team_info.team_rank,
        team_office: formdata.team_info.team_office,
        team_mail: formdata.team_info.team_mail,
      },
    });
    this.userForm.markAsPristine();
  }

  getForm(): FormGroup {
    return this.userForm;
  }

  resetForm() {
    this.userForm.reset({ status: false });
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.clearFormFromStorage()
    this.editing.set(false);
    this.editingId.set('');
  }

  // ✅ Call this after successful submit — disables both guards
  markClean() {
    this.userForm.markAsPristine();
  }

  hasUnsavedChanges(): boolean {
    return this.userForm.dirty;
  }

  isValid(): boolean {
    return this.userForm.valid;
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
    this.userForm.patchValue(formValue); // use productForm in FormService
    // deliberately does NOT set editing or editingId
  }
}
