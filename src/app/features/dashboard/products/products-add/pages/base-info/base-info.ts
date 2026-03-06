import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSelect } from '@app/shared/components/custom-select/custom-select';
import { CustomInputConfig, GenericInput } from "@app/shared/components/generic-input/generic-input";
import { InputConfigs } from '../../config/input-cinfigs';

@Component({
  selector: 'app-base-info',
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CustomSelect, GenericInput],
  templateUrl: './base-info.html',
  styleUrl: './base-info.css',
})
export class BaseInfo implements OnInit {

  baseInfo: FormGroup;

  productNameConfig : CustomInputConfig;
  productCategoryConfig : CustomInputConfig;
  productCompanyConfig : CustomInputConfig;
  
  productForm = inject(FormService);
  
  constructor() {
    this.productForm.getForm().valid ? this.productForm.editing.set(true) : this.productForm.editing.set(false);
    
    this.baseInfo = this.productForm.getForm().get('basic_info') as FormGroup;
    this.baseInfo.markAllAsTouched();

    this.productNameConfig = new InputConfigs().productNameConfig;
    this.productCategoryConfig = new InputConfigs().productCategoryConfig;
    this.productCompanyConfig = new InputConfigs().productCompanyConfig;

  }
  
  ngOnInit(): void { }

  get product_name() {
    return this.baseInfo.get("product_name");
  }

  get product_price() {
    return this.baseInfo.get("product_price");
  }

  get product_category() {
    return this.baseInfo.get("product_category");
  }

  get product_company() {
    return this.baseInfo.get("product_company");
  }

}
