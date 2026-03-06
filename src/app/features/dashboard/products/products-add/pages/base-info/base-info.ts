import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { companyListInterface } from '@app/shared/interface/company-list.interface';
import { productListInterface } from '@app/shared/interface/product-list.interface';
import { ListService } from '@app/shared/services/companylist/company-list-service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSelect } from '@app/shared/components/custom-select/custom-select';

@Component({
  selector: 'app-base-info',
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CustomSelect],
  templateUrl: './base-info.html',
  styleUrl: './base-info.css',
})
export class BaseInfo implements OnInit {

  baseInfo: FormGroup;
  productsList: productListInterface[];
  companiesList: companyListInterface[];

  productForm = inject(FormService);
  private listService = inject(ListService);

  constructor() {
    this.productForm.getForm().valid ? this.productForm.editing.set(true) : this.productForm.editing.set(false);

    this.baseInfo = this.productForm.getForm().get('basic_info') as FormGroup;
    this.baseInfo.markAllAsTouched();

    
    this.companiesList = this.listService.getCompanyList();
    this.productsList = this.listService.getProductList();
  }
  
  ngOnInit(): void {
    
  }

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
