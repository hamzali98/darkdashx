import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../interface/user';

@Injectable({
  providedIn: 'root',
})
export class Formservice {

  editing = signal(false);
  editingId = signal('');

  fB = inject(FormBuilder);

  userForm! : any;

  constructor(){
    this.initForm();
  }

  initForm(){
    this.userForm = this.fB.group({
    status: [false],
    personal_info: this.fB.group({
      user_name: ['', Validators.required],
      user_email: ['newuser@gmail.com', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      user_photo: [''],
      user_desc: ['hello new user', Validators.required],
    }),
    basic_info: this.fB.group({
      user_phone: ['3123456789', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      user_position: ['POS', Validators.required],
      user_location: ['LOC', Validators.required],
      user_website: ['www.website.com', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)]],
    }),
    team_info: this.fB.group({
      team_name: ['google', Validators.required],
      team_rank: ['Rank', Validators.required],
      team_office: ['office', Validators.required],
      team_mail: ['team@email.com', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
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
