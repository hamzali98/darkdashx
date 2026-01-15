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

@Component({
  selector: 'app-products',
  imports: [SearchBar, GenericTable],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  length: number = 0;

  parentSearchKey = signal('');


  url: string = environment.PRODUCTS_URL;

  productData: product[] = [];
  productColumns: any[];

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  loaderService = inject(Loaderservice);
  private productFormService = inject(FormService);
  private snackService = inject(SnackBarService);

  constructor() {
    this.productColumns = [
      { key: ["basic_info", "product_name"], icon: "assets/icons/neutral/product.svg", label: "Product Name" },
      { key: ["basic_info", "product_category"], icon: "assets/icons/neutral/category.svg", label: "Category" },
      { key: ["basic_info", "product_price"], icon: "assets/icons/neutral/dollar.svg", label: "Price" },
      { key: ["basic_info", "product_company"], icon: "assets/icons/neutral/bag.svg", label: "Company" },
      { func: (v: any) => v === true ? "In stock" : "Out of stock", key: "status", icon: "assets/icons/neutral/statustick.svg", label: "Status" },
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
            this.snackService.error("No data found", 2000, 'top-right');
          }
          this.productData = res.body;
          this.length = this.productData.length;
          this.snackService.success("Data fetched successfully!", 2000, 'top-right');
          // this.loaderService.hideLoader();
        },
        error: (err) => {
          // console.log(err);
          this.snackService.error("Data fetching failed!", 2000, 'top-right');
          // this.loaderService.hideLoader();
        },
      })
  }

  deleteProductData(val: product) {
    this.loaderService.showLoader();
    // console.log("prod data in prod view", val);
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success("Data deleted successfully!", 2000, 'bottom-right');
        // console.log(res);
        this.loaderService.hideLoader();
        this.getProductData();
      },
      error: (err) => {
        this.snackService.error("Data deletion failed!", 2000, 'bottom-right');
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
