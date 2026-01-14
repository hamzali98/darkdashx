import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';

@Component({
  selector: 'app-personal-information',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css',
})
export class PersonalInformation {

  personalInfo: FormGroup;
  userForm = inject(Formservice);

  constructor(){
    this.userForm.getForm().valid ? this.userForm.editing.set(true) : this.userForm.editing.set(false);

    this.personalInfo = this.userForm.getForm().get('personal_info') as FormGroup;
    this.personalInfo.markAllAsTouched();
  }

  get user_name(){
    return this.personalInfo.get('user_name');
  }
  get user_email(){
    return this.personalInfo.get('user_email');
  }
  get user_photo(){
    return this.personalInfo.get('user_photo');
  }
  get user_desc(){
    return this.personalInfo.get('user_desc');
  }
}
