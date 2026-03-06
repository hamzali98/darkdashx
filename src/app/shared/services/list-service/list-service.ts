import { Injectable } from '@angular/core';
import { product } from '@app/features/dashboard/products/interface/product-interface';
import { companyListInterface } from '@app/shared/interface/company-list.interface';
import { productListInterface } from '@app/shared/interface/product-list.interface';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  private readonly companiesList: companyListInterface[] = [
    { key: "Google", value: "google" },
    { key: "Facebook", value: "facebook" },
    { key: "Linkedin", value: "linkedin" },
    { key: "Pinterest", value: "pinterest" },
    { key: "Reddit", value: "reddit" },
    { key: "Spotify", value: "spotify" },
    { key: "Twitter", value: "twitter" },
    { key: "Youtube", value: "youtube" },
  ];

  private readonly productsList: productListInterface[] = [
      { key: 'Accessories', value: 'accessories' },
      { key: 'Telecomunication', value: 'telecomunication' },
      { key: 'Note Book', value: 'note book' },
      { key: 'Digital', value: 'digital' }, 
      { key: 'Cosmetics', value: 'cosmetics' }, 
      { key: 'Electric', value: 'electric' }, 
      { key: 'Network', value: 'network' },
    ];

  getCompanyList(): companyListInterface[] {
    return this.companiesList;
  }

  getProductList(): productListInterface[] {
    return this.productsList;
  }
}
