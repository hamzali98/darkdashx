import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { productCategories } from '../../../interface/product-categories';
import { companyInterface } from '@app/shared/interface/company';
import { CompanyListService } from '@app/shared/services/companylist/company-list-service';

@Component({
  selector: 'app-base-info',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './base-info.html',
  styleUrl: './base-info.css',
})
export class BaseInfo {


  baseInfo: FormGroup;
  productCategories: productCategories[];
  companyList: companyInterface[];

  productForm = inject(FormService);
  private companyListService = inject(CompanyListService);

  constructor() {
    this.baseInfo = this.productForm.getForm().get('basic_info') as FormGroup;
    this.baseInfo.markAllAsTouched();

    this.productCategories = [
      { key: 'Accessories', value: 'accessories' },
      { key: 'Telecomunication', value: 'telecomunication' },
      { key: 'Note Book', value: 'note book' },
      { key: 'Digital', value: 'digital' }, 
      { key: 'Cosmetics', value: 'cosmetics' }, 
      { key: 'Light', value: 'light' }, 
      { key: 'Network', value: 'network' },
    ];
    this.companyList = this.companyListService.getCompanyList();
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
