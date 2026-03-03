import { inject, Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { Loaderservice } from '../loader/loaderservice';
import { Router } from '@angular/router';
import { TranslationService } from '@app/core/services/translate.service';
import { Formservice } from '@app/features/users/adduser/services/formservice';
import { BehaviorSubject, finalize } from 'rxjs';
import { Httpservice } from '../httpservice/httpservice';
import { SnackBarService } from '../snackbar/snack-bar-service';
import { environment } from '@environments/environment.development';
import { User } from '@app/features/users/interface/user';
import { product } from '@app/features/dashboard/products/interface/product-interface';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService implements OnDestroy {

  private readonly user_url: string = environment.USER_URL;
  private readonly product_url: string = environment.PRODUCTS_URL;

  private userData$ = new BehaviorSubject<User[]>([]);
  private productData$ = new BehaviorSubject<product[]>([]);

  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);

  constructor() {
    this.getUserData();
    this.getProductData();
  }

  ngOnDestroy(): void {
    this.userData$.complete();
    this.productData$.complete();
  }

  // remove from constructor, change to getter:
  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  sharedUserData() {
    return this.userData$.asObservable();
  }

  sharedProductData() {
    return this.productData$.asObservable();
  }

  private getUserData() {
    console.log("calling data fetch service to get user data");
    this.httpService.getApi(this.user_url)
    .subscribe({
      next: (res) => {
        this.userData$.next(res.body ?? []);
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
      },
      error: (err) => {
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
      },
    })
  }
  
  private getProductData() {
    console.log("calling data fetch service to get products data");
    this.httpService.getApi(this.product_url)
      .subscribe({
        next: (res) => {
          if (!res.body) {
            this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
          }
          this.productData$.next(res.body ?? []);
          this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
        },
        error: (err) => {
          this.snackService.error(this.isRTL ? "ڈیٹا لینے میں ناکام!" : "Data fetching failed!", 2000, 'top-right');
        },
      })
  }
}
