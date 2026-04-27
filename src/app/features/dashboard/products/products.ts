import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { product } from './interface/product-interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormService } from './products-add/service/form-service';
import { environment } from '@environments/environment.development';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { GenericTable } from "@app/shared/components/generic-table/generic-table";
import { GenericViewPage } from "@app/shared/components/generic-view-page/generic-view-page";
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-products',
  imports: [GenericTable, TranslateModule, GenericViewPage, TotalsCards],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  length = signal(0);
  parentSearchKey = signal('');
  productData = signal<product[]>([]);

  private readonly url: string = environment.PRODUCTS_URL;

  private productTableConfig: any[];

  private routerRef = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private productFormService = inject(FormService);
  private dataFetchService = inject(DataFetchService);
  private tickAnimationService = inject(TickAnimationService);
  private translateService = inject(TranslateService);

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

  editproductData(val: product) {
    this.productFormService.patchFormData(val);
    this.routerRef.navigate(['/products/add']);
  }

  private loadProducts() {
    this.dataFetchService.sharedProductData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {

          this.productData.set(res ?? []);
          this.length.set(res?.length ?? 0);

        },
        error: () => {
          this.snackService.error(
            this.translateService.instant('Server Error!'),
            2000,
            'top-right'
          );
        }
      });
  }

  deleteProductData(val: product) {

    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success(this.translateService.instant("Data deleted successfully!"), 2000, 'bottom-right');
        // 2️⃣ Now we update UI locally
        const updated = this.productData()
          .filter(p => p.id !== val.id);

        this.productData.set(updated); //component data update
        this.dataFetchService.refreshData("products", updated); // shared data update for other components
        this.tickAnimationService.show(this.translateService.instant("Deleted!"), 3000);

      },
      error: (err) => {
        this.snackService.error(this.translateService.instant("Data deletion failed!"), 2000, 'bottom-right');
      }
    })
  }

  deleteAllProductsData(selectedItems: product[]) {

    // console.log("Selected items to delete:", selectedItems);
    if (!selectedItems.length) return;

    // Create a queue of ids to delete
    const idsToDelete = [...selectedItems.map(item => item.id)];
    let deletedCount = 0;

    const deleteNext = (index: number) => {
      if (index >= idsToDelete.length) {
        // ✅ All done — show tick animation once at the end
        this.tickAnimationService.show(this.translateService.instant("Deleted!"), 3000);
        selectedItems = []; // clear selection
        return;
      }

      const id = idsToDelete[index];

      this.httpService.delApi(this.url, id).subscribe({
        next: (res) => {
          deletedCount++;

          // Update local data after each deletion
          const updated = this.productData().filter(p => p.id !== id);
          this.productData.set(updated);
          this.dataFetchService.refreshData("products", updated);

          // Show snack per item OR just once at the end — your choice
          this.snackService.success(
            this.translateService.instant('DELETE_PROGRESS', {
              deleted: deletedCount,
              total: idsToDelete.length
            }),
            2000, 'bottom-right'
          );

          // 👇 Delete next item after this one succeeds
          deleteNext(index + 1);
        },
        error: (err) => {
          this.snackService.error(
            this.translateService.instant('DELETE_ITEM_FAIL', { item: index + 1 }),
            2000, 'bottom-right'
          );

          // ⚠️ Decide: stop on error OR continue to next
          // To STOP:  return;
          // To CONTINUE anyway:
          deleteNext(index + 1);
        }
      });
    };

    deleteNext(0); // kick off the chain
  }

}
