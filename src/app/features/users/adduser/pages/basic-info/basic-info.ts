import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';


@Component({
  selector: 'app-basic-info',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.css',
})
export class BasicInfo {

  personalInfo: FormGroup;
  basicInfo: FormGroup;
  userForm = inject(Formservice);

  constructor() {
    this.personalInfo = this.userForm.getForm().get('personal_info') as FormGroup;
    this.basicInfo = this.userForm.getForm().get('basic_info') as FormGroup;
    this.basicInfo.markAllAsTouched();
    // console.log(this.personalInfo.value);
  }

  get user_phone() {
    return this.basicInfo.get('user_phone');
  }
  get user_position() {
    return this.basicInfo.get('user_position');
  }
  get user_location() {
    return this.basicInfo.get('user_location');
  }
  get user_website() {
    return this.basicInfo.get('user_website');
  }
}
