import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { GenericTable } from "@app/shared/components/generic-table/generic-table";
import { product } from './interface/product-interface';
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [SearchBar, TotalsCards, GenericTable],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  length : number = 0;

  productData! : product[];
  productColumns : any[];

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);

  constructor(){
    this.productColumns = [
      { key: ["basic_info", "product_name"], icon: "assets/icons/neutral/product.svg", label: "Product Name" },
      { key: ["basic_info", "product_category"], icon: "assets/icons/neutral/category.svg", label: "Category" },
      { key: ["basic_info", "product_price"], icon: "assets/icons/neutral/dollar.svg", label: "Price" },
      { key: ["basic_info", "product_company"], icon: "assets/icons/neutral/bag.svg", label: "Company" },
      { func:  (v: any) => v ===true ? "In stock" : "Out of stock" , key: "status", icon: "assets/icons/neutral/statustick.svg", label: "Status" },
    ]
    this.getProductData();
  }

  goToroute(){
    this.routerRef.navigate(['home/products/add']);
  }

   getProductData() {
      this.loaderService.showLoader();
      this.httpService.getApi('products').pipe(
        finalize(() => {
          this.loaderService.hideLoader();
        }),
      ).subscribe({
        next: (res) => {
          console.log(res);
          this. productData = res.body;
          this.length = this. productData.length;
        },
        error: (err) => {
          console.log(err);
        },
      })
    }

  deleteProductData(event : any){

  }
}
