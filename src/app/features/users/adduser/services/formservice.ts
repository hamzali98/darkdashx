import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Formservice {

  fB = inject(FormBuilder);

  userForm2 = this.fB.group({
    personal_info: this.fB.group({
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      user_photo: [''],
      user_desc: ['', Validators.required],
    }),
    basic_info: this.fB.group({
      user_phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      user_position: ['', Validators.required],
      user_location: ['', Validators.required],
      user_website: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)]],
    }),
    team_info: this.fB.group({
      team_name: ['', Validators.required],
      team_rank: ['', Validators.required],
      team_office: ['', Validators.required],
      team_mail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    }),
  })

  getForm() {
    return this.userForm2;
  }
}
