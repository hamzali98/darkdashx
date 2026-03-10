import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';
import { TranslateModule } from '@ngx-translate/core';
import { FormStyle } from "@app/shared/components/form-style/form-style";
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { InputConfigs } from '../../config/input-configs';

@Component({
  selector: 'app-personal-information',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, FormStyle, GenericInput],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css',
})
export class PersonalInformation {

  personalInfo: FormGroup;
  userForm = inject(Formservice);

  userNameConfig: CustomInputConfig;
  userEmailConfig: CustomInputConfig;
  userDescConfig: CustomInputConfig;

  constructor(){
    this.userForm.getForm().valid ? this.userForm.editing.set(true) : this.userForm.editing.set(false);

    this.personalInfo = this.userForm.getForm().get('personal_info') as FormGroup;
    this.personalInfo.markAllAsTouched();

    this.userNameConfig = new InputConfigs().userNameConfig;
    this.userEmailConfig = new InputConfigs().userEmailConfig;
    this.userDescConfig = new InputConfigs().userDescConfig;
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
