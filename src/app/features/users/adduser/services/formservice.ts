import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../interface/user';
import { customEmailValidator } from '@app/shared/validators/email-validator';

@Injectable({
  providedIn: 'root',
})
export class Formservice {

  editing = signal(false);
  editingId = signal('');

  fB = inject(FormBuilder);

  userForm!: any;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.fB.group({
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
  }

  patchFormData(formdata: User) {
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
    })
  }

  getForm() {
    return this.userForm;
  }

  resetForm() {
    this.initForm();
  }
}
