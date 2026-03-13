import { inject, Injectable } from '@angular/core';
import { companyListInterface } from '@app/shared/interface/company-list.interface';
import { productListInterface } from '@app/shared/interface/product-list.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  private translateService = inject(TranslateService);

  // private readonly companiesList: companyListInterface[] = [
  //   { key: "Google", value: "google" },
  //   { key: "Facebook", value: "facebook" },
  //   { key: "Linkedin", value: "linkedin" },
  //   { key: "Pinterest", value: "pinterest" },
  //   { key: "Reddit", value: "reddit" },
  //   { key: "Spotify", value: "spotify" },
  //   { key: "Twitter", value: "twitter" },
  //   { key: "Youtube", value: "youtube" },
  // ];

  // private readonly productsList: productListInterface[] = [
  //   { key: 'Accessories', value: 'accessories' },
  //   { key: 'Telecomunication', value: 'telecomunication' },
  //   { key: 'Note Book', value: 'note book' },
  //   { key: 'Digital', value: 'digital' },
  //   { key: 'Cosmetics', value: 'cosmetics' },
  //   { key: 'Electric', value: 'electric' },
  //   { key: 'Network', value: 'network' },
  // ];

  private readonly companiesList: companyListInterface[] = [
    { key: "Google", value: this.translateService.instant("Google") },
    { key: "Facebook", value: this.translateService.instant("Facebook") },
    { key: "Linkedin", value: this.translateService.instant("Linkedin") },
    { key: "Pinterest", value: this.translateService.instant("Pinterest") },
    { key: "Reddit", value: this.translateService.instant("Reddit") },
    { key: "Spotify", value: this.translateService.instant("Spotify") },
    { key: "Twitter", value: this.translateService.instant("Twitter") },
    { key: "Youtube", value: this.translateService.instant("Youtube") },
  ];

  private readonly productsList: productListInterface[] = [
    { key: 'Accessories', value: this.translateService.instant('Accessories') },
    { key: 'Telecomunication', value: this.translateService.instant('Telecomunication') },
    { key: 'Note Book', value: this.translateService.instant('Note Book') },
    { key: 'Digital', value: this.translateService.instant('Digital') },
    { key: 'Cosmetics', value: this.translateService.instant('Cosmetics') },
    { key: 'Electric', value: this.translateService.instant('Electric') },
    { key: 'Network', value: this.translateService.instant('Network') },
  ];

  getCompanyList(): companyListInterface[] {
    return this.companiesList;
  }

  getProductList(): productListInterface[] {
    return this.productsList;
  }
}
