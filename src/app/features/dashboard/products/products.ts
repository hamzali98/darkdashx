import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { GenericTable } from "@app/shared/components/generic-table/generic-table";
import { product } from './interface/product-interface';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';
import { FormService } from './products-add/service/form-service';
import { environment } from '@environments/environment.development';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '@app/core/services/translate.service';

@Component({
  selector: 'app-products',
  imports: [SearchBar, GenericTable, TranslateModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  isRTL: boolean;

  // length: number = 0;

  length = signal(0);
  parentSearchKey = signal('');


  url: string = environment.PRODUCTS_URL;

  productData: product[] = [];
  productColumns: any[];

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  loaderService = inject(Loaderservice);
  private productFormService = inject(FormService);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);

  constructor() {
    this.isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
    this.productColumns = [
      { key: ["basic_info", "product_name"], icon: "assets/icons/neutral/product.svg", label: "GENERIC_TABLE.PRODUCT_NAME" },
      { key: ["basic_info", "product_category"], icon: "assets/icons/neutral/category.svg", label: "GENERIC_TABLE.CATEGORY" },
      { key: ["basic_info", "product_price"], icon: "assets/icons/neutral/dollar.svg", label: "GENERIC_TABLE.PRICE" },
      { key: ["basic_info", "product_company"], icon: "assets/icons/neutral/bag.svg", label: "GENERIC_TABLE.COMPANY" },
      { func: (v: any) => v === true ? "GENERIC_TABLE.IN_STOCK" : "GENERIC_TABLE.OUT_OF_STOCK", key: "status", icon: "assets/icons/neutral/statustick.svg", label: "GENERIC_TABLE.STATUS" },
    ];

  }

  ngOnInit() {
    this.productFormService.resetForm();
    this.getProductData();
  }

  goToroute() {
    this.routerRef.navigate(['home/products/add']);
  }

  getProductData() {
    this.loaderService.showLoader();
    this.httpService.getApi(this.url).pipe(
      finalize(() => {
        this.loaderService.hideLoader();
      })
    )
      .subscribe({
        next: (res) => {
          // console.log(res);
          if (res.body) {
            this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
          }
          setTimeout(() => {
            this.productData = res.body;
          }, 2000);
          // this.length.set(this.productData.length ?? 0);
          // this.length = this.productData.length;
          this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
          // this.loaderService.hideLoader();
        },
        error: (err) => {
          // console.log(err);
          this.snackService.error(this.isRTL ? "ڈیٹا لینے میں ناکام!" : "Data fetching failed!", 2000, 'top-right');
          // this.loaderService.hideLoader();
        },
      })
  }

  deleteProductData(val: product) {
    this.loaderService.showLoader();
    // console.log("prod data in prod view", val);
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');
        // console.log(res);
        this.loaderService.hideLoader();
        this.getProductData();
      },
      error: (err) => {
        this.snackService.error(this.isRTL ? "ڈیٹا حذف کرنے میں ناکام!" : "Data deletion failed!", 2000, 'bottom-right');
        // console.log(err);
        this.loaderService.hideLoader();
      }
    })
  }

  editproductData(val: product) {
    // console.log("editing data", val);
    this.loaderService.showLoader();
    this.productFormService.patchFormData(val);
    this.loaderService.hideLoader();
    this.routerRef.navigate(['home/products/add']);
  }
}
