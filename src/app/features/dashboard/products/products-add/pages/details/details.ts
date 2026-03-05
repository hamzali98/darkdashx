import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';
import { TranslateModule } from '@ngx-translate/core';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';
import { finalize } from 'rxjs';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { product } from '../../../interface/product-interface';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  private url: string = environment.PRODUCTS_URL;

  detailInfo: FormGroup;
  private productFormSubmit: FormGroup;

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private prodcutFormService = inject(FormService);
  private dataFetchService = inject(DataFetchService);
  private translationService = inject(TranslationService);
  private tickAnimationService = inject(TickAnimationService);

  constructor() {
    this.productFormSubmit = this.prodcutFormService.getForm();
    this.detailInfo = this.prodcutFormService.getForm().get('detail_info') as FormGroup;
    this.detailInfo.markAllAsTouched();
  }

  get product_mfg() { return this.detailInfo.get("product_mfg"); }
  get product_regno() { return this.detailInfo.get("product_regno"); }
  get product_stock() { return this.detailInfo.get("product_stock"); }
  get product_expiry() { return this.detailInfo.get("product_expiry"); }
  get productFormEditing() { return this.prodcutFormService.editing(); }
  get isRTL(): boolean { return this.translationService.getCurrentLanguage() === 'ur'; }

  onFormSubmit() {
    if (this.productFormSubmit.invalid) {
      this.snackService.warning(
        this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!",
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
              this.isRTL ? "ڈیٹا کامیابی سے اپ ڈیٹ ہو گیا!" : "Product updated successfully!",
              2000, 'bottom-right'
            );
            this.tickAnimationService.show(this.isRTL ? "اپ ڈیٹ ہو گیا!" : "Updated!", 3000);

            setTimeout(() => {
              this.prodcutFormService.resetForm();
              this.routerRef.navigate(['/products']);
            }, 2000);
          },
          error: (err) => {
            this.snackService.error(
              this.isRTL ? "اپ ڈیٹ ناکام!" : "Update failed!",
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
              this.isRTL ? "ڈیٹا کامیابی سے شامل ہو گیا!" : "Product added successfully!",
              2000, 'bottom-right'
            );
            this.tickAnimationService.show(this.isRTL ? "شامل ہو گیا!" : "Added!", 3000);
            
            setTimeout(() => {
              this.prodcutFormService.resetForm();
              this.routerRef.navigate(['/products']);
            }, 2000);
          },
          error: (err) => {
            this.snackService.error(
              this.isRTL ? "ڈیٹا شامل کرنے میں ناکام!" : "Failed to add product!",
              2000, 'bottom-right'
            );
          }
        })
      }
    }
  }
}
