import { AfterViewInit, Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { GenericTable } from "@app/shared/components/generic-table/generic-table";
import { product } from './interface/product-interface';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
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
export class Products implements OnInit {

  url: string = environment.PRODUCTS_URL;

  length = signal(0);
  parentSearchKey = signal('');
  productData = signal<product[]>([]);

  private productTableConfig: any[];
  // productData: product[] = [];
  // productColumns: any[];

  private routerRef = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private productFormService = inject(FormService);
  private dataFetchService = inject(DataFetchService);
  private translationService = inject(TranslationService);

  constructor() {
    this.productTableConfig = [
      { key: ["basic_info", "product_name"], icon: "assets/icons/neutral/product.svg", label: "PRODUCT_NAME" },
      { key: ["basic_info", "product_category"], icon: "assets/icons/neutral/category.svg", label: "CATEGORY" },
      { key: ["basic_info", "product_price"], icon: "assets/icons/neutral/dollar.svg", label: "PRICE" },
      { key: ["basic_info", "product_company"], icon: "assets/icons/neutral/bag.svg", label: "COMPANY" },
      { func: (v: any) => v === true ? "IN_STOCK" : "OUT_OF_STOCK", key: "status", icon: "assets/icons/neutral/statustick.svg", label: "STATUS" },
    ];
  }

  ngOnInit(): void {
    this.loadProducts();
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

  private loadProducts() {
    this.loaderService.showLoader();

    this.dataFetchService.sharedProductData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {

          this.productData.set(res ?? []);
          this.length.set(res?.length ?? 0);

          if (!res || res.length === 0) {
            this.snackService.error(
              this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found",
              2000,
              'top-right'
            );
          }
          this.loaderService.hideLoader();
        },
        error: () => {
          this.snackService.error(
            this.isRTL ? "سرور کی خرابی!" : "Server Error!",
            2000,
            'top-right'
          );
          this.loaderService.hideLoader();
        }
      });
  }

  deleteProductData(val: product) {
    this.loaderService.showLoader();
    
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');
        // 2️⃣ Now we update UI locally
        const updated = this.productData()
          .filter(p => p.id !== val.id);

        this.productData.set(updated); //component data update
        this.dataFetchService.refreshData("products", updated); // shared data update for other components
        this.loaderService.hideLoader();
      },
      error: (err) => {
        this.snackService.error(this.isRTL ? "ڈیٹا حذف کرنے میں ناکام!" : "Data deletion failed!", 2000, 'bottom-right');
        this.loaderService.hideLoader();
      }
    })
  }

  editproductData(val: product) {
    this.loaderService.showLoader();
    this.productFormService.patchFormData(val);
    this.loaderService.hideLoader();
    this.routerRef.navigate(['home/products/add']);
  }
}
