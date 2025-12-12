import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormService } from '../../service/form-service';

@Component({
  selector: 'app-base-info',
  imports: [FormsModule, ReactiveFormsModule ],
  templateUrl: './base-info.html',
  styleUrl: './base-info.css',
})
export class BaseInfo {


    baseInfo : FormGroup;

    productForm = inject(FormService);

  constructor(){
    this.baseInfo = this.productForm.getForm().get('basic_info') as FormGroup;
    this.baseInfo.markAllAsTouched();
  }

  get product_name(){
    return this.baseInfo.get("product_name");
  }

  get product_price(){
    return this.baseInfo.get("product_price");
  }

  get product_category(){
    return this.baseInfo.get("product_category");
  }

  get product_company(){
    return this.baseInfo.get("product_company");
  }

}
