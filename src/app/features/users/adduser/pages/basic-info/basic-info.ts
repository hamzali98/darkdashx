import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';
import { TranslateModule } from '@ngx-translate/core';
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { InputConfigs } from '../../config/input-configs';
import { FormStyle } from "@app/shared/components/form-style/form-style";

@Component({
  selector: 'app-basic-info',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, FormStyle, GenericInput],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.css',
})
export class BasicInfo {


  personalInfo: FormGroup;
  basicInfo: FormGroup;
  userForm = inject(Formservice);

  userPhoneConfig: CustomInputConfig;
  userPositionConfig: CustomInputConfig;
  userLocationConfig: CustomInputConfig;
  userWebsiteConfig: CustomInputConfig;

  constructor() {
    this.personalInfo = this.userForm.getForm().get('personal_info') as FormGroup;
    this.basicInfo = this.userForm.getForm().get('basic_info') as FormGroup;
    this.basicInfo.markAllAsTouched();

    this.userPhoneConfig = new InputConfigs().userPhoneConfig;
    this.userPositionConfig = new InputConfigs().userPositionConfig;
    this.userLocationConfig = new InputConfigs().userLocationConfig;
    this.userWebsiteConfig = new InputConfigs().userWebsiteConfig;
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
