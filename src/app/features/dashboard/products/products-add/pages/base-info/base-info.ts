import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSelect } from '@app/shared/components/custom-select/custom-select';
import { CustomInputConfig, GenericInput } from "@app/shared/components/generic-input/generic-input";
import { InputConfigs } from '../../config/input-configs';
import { FormStyle } from "@app/shared/components/form-style/form-style";

@Component({
  selector: 'app-base-info',
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, GenericInput, FormStyle],
  templateUrl: './base-info.html',
  styleUrl: './base-info.css',
})
export class BaseInfo implements OnInit {

  baseInfo: FormGroup;

  productNameConfig : CustomInputConfig;
  productCategoryConfig : CustomInputConfig;
  productPriceConfig : CustomInputConfig;
  productCompanyConfig : CustomInputConfig;
  
  productFormService = inject(FormService);
  
  constructor() {
    
    this.baseInfo = this.productFormService.getForm().get('basic_info') as FormGroup;
    this.baseInfo.markAllAsTouched();

    this.productNameConfig = new InputConfigs().productNameConfig;
    this.productCategoryConfig = new InputConfigs().productCategoryConfig;
    this.productPriceConfig = new InputConfigs().productPriceConfig;
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
