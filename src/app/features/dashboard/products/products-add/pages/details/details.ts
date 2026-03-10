import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { product } from '../../../interface/product-interface';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';
import { CustomInputConfig, GenericInput } from "@app/shared/components/generic-input/generic-input";
import { InputConfigs } from '../../config/input-configs';
import { FormStyle } from "@app/shared/components/form-style/form-style";

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, GenericInput, FormStyle],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  private url: string = environment.PRODUCTS_URL;

  detailInfo: FormGroup;
  // private productFormSubmit: FormGroup;
  productExpiryConfig: CustomInputConfig;
  productRegConfig: CustomInputConfig;
  productMfgConfig: CustomInputConfig;
  productStockConfig: CustomInputConfig;

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private prodcutFormService = inject(FormService);
  private dataFetchService = inject(DataFetchService);
  private tickAnimationService = inject(TickAnimationService);
  private translateModule = inject(TranslateService);

  constructor() {
    // this.productFormSubmit = this.prodcutFormService.getForm();
    this.detailInfo = this.prodcutFormService.getForm().get('detail_info') as FormGroup;
    this.detailInfo.markAllAsTouched();

    this.productExpiryConfig = new InputConfigs().productExpiryConfig;
    this.productRegConfig = new InputConfigs().productRegConfig;
    this.productMfgConfig = new InputConfigs().productMfgConfig;
    this.productStockConfig = new InputConfigs().productStockConfig;
  }

  get product_mfg() { return this.detailInfo.get("product_mfg"); }
  get product_regno() { return this.detailInfo.get("product_regno"); }
  get product_stock() { return this.detailInfo.get("product_stock"); }
  get product_expiry() { return this.detailInfo.get("product_expiry"); }
  get productFormEditing(): boolean { return this.prodcutFormService.editing(); }
  get CurrentDate(): string { return new Date().toISOString().split('T')[0]; } // format: YYYY-MM-DD 
  get productFormSubmit(): FormGroup { return this.prodcutFormService.getForm(); }

  private navigate(): void {
    this.routerRef.navigate(['/products'])
  }

  onCancel() {
    this.prodcutFormService.resetForm();
    this.navigate();
  }

  onFormSubmit() {
    if (this.productFormSubmit.invalid) {
      this.snackService.warning(
        this.translateModule.instant('req_fields_msg'),
        5000,
        'bottom-center');
      return;
    } else {

      if (this.productFormEditing) {
        const id = this.prodcutFormService.editingId();
        this.httpService.editApi(this.url, id, this.productFormSubmit.value).subscribe({
          next: (res) => {
            // ✅ Update the edited entry in the shared BehaviorSubject
            const updatedProduct = res as product;
            const current = this.dataFetchService.getProductSnapshot(); // 👇 see service change below

            const updated = current.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            this.dataFetchService.refreshData('products', updated);

            this.snackService.success(
              this.translateModule.instant('update_success'),
              2000, 'bottom-right'
            );
            this.tickAnimationService.show(this.translateModule.instant("Updated!"), 3000);

            this.prodcutFormService.markClean(); // 👈 disables both guards before navigate
            setTimeout(() => {
              this.prodcutFormService.resetForm();
              this.navigate();
            }, 2000);
          },
          error: (err) => {
            this.snackService.error(
              this.translateModule.instant('update_fail'),
              2000, 'bottom-right'
            );
          }
        })
      } else {
        this.httpService.addApi(this.url, this.productFormSubmit.value).subscribe({
          next: (res) => {
            // ✅ Append the new entry into the shared BehaviorSubject
            const newProduct = res as product;
            const current = this.dataFetchService.getProductSnapshot();
            this.dataFetchService.refreshData('products', [...current, newProduct]);

            this.snackService.success(
              this.translateModule.instant('add_success'),
              2000, 'bottom-right'
            );
            this.tickAnimationService.show(this.translateModule.instant('Added!'), 3000);

            this.prodcutFormService.markClean(); // 👈 disables both guards before navigate
            setTimeout(() => {
              this.prodcutFormService.resetForm();
              this.navigate();
            }, 2000);
          },
          error: (err) => {
            this.snackService.error(
              this.translateModule.instant('add_fail'),
              2000, 'bottom-right'
            );
          }
        })
      }
    }
  }
}
