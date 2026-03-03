import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
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
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';

@Component({
  selector: 'app-products',
  imports: [SearchBar, GenericTable, TranslateModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements AfterViewInit {

  url: string = environment.PRODUCTS_URL;

  length = signal(0);
  parentSearchKey = signal('');
  productData = signal<product[]>([]);

  private productTableConfig: any[];
  // productData: product[] = [];
  // productColumns: any[];

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private productFormService = inject(FormService);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);
  private dataFetchService = inject(DataFetchService);

  constructor() {
    this.productTableConfig = [
      { key: ["basic_info", "product_name"], icon: "assets/icons/neutral/product.svg", label: "PRODUCT_NAME" },
      { key: ["basic_info", "product_category"], icon: "assets/icons/neutral/category.svg", label: "CATEGORY" },
      { key: ["basic_info", "product_price"], icon: "assets/icons/neutral/dollar.svg", label: "PRICE" },
      { key: ["basic_info", "product_company"], icon: "assets/icons/neutral/bag.svg", label: "COMPANY" },
      { func: (v: any) => v === true ? "IN_STOCK" : "OUT_OF_STOCK", key: "status", icon: "assets/icons/neutral/statustick.svg", label: "STATUS" },
    ];
  }

  ngAfterViewInit(): void {
    this.getProductData();
  }

  get productTableConfigGetter() {
    return this.productTableConfig;
  }

  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  goToroute() {
    this.routerRef.navigate(['home/products/add']);
  }

  getProductData() {
    this.loaderService.showLoader();
    this.dataFetchService.sharedProductData().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
        }
        this.productData.set(res);
        this.length.set(res.length ?? 0);
        this.loaderService.hideLoader();
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
      },
      error: (err) => {
        this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
      }
    });
    // this.httpService.getApi(this.url).subscribe({
    //     next: (res) => {
    //       // console.log(res);
    //       if (res.body) {
    //         this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
    //       }
    //       setTimeout(() => {
    //         this.productData = res.body;
    //       }, 2000);
    //       // this.length.set(this.productData.length ?? 0);
    //       // this.length = this.productData.length;
    //       this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
    //       // this.loaderService.hideLoader();
    //     },
    //     error: (err) => {
    //       // console.log(err);
    //       this.snackService.error(this.isRTL ? "ڈیٹا لینے میں ناکام!" : "Data fetching failed!", 2000, 'top-right');
    //       // this.loaderService.hideLoader();
    //     },
    //   })
  }

  deleteProductData(val: product) {
    this.loaderService.showLoader();
    // console.log("prod data in prod view", val);
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        // console.log(res);
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');
        this.getProductData();
        // this.loaderService.hideLoader();
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
