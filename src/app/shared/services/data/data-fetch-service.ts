import { BehaviorSubject, take } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { Httpservice } from '../httpservice/httpservice';
import { SnackBarService } from '../snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';
import { environment } from '@environments/environment.development';
import { User } from '@app/features/users/interface/user';
import { product } from '@app/features/dashboard/products/interface/product-interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {

  private readonly user_url: string = environment.USER_URL;
  private readonly product_url: string = environment.PRODUCTS_URL;

  private usersLoaded = signal(false);
  private productsLoaded = signal(false);

  private userData$ = new BehaviorSubject<User[]>([]);
  private productData$ = new BehaviorSubject<product[]>([]);

  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);
  private translateService = inject(TranslateService);

  // remove from constructor, change to getter:
  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  sharedUserData(noFetching: boolean = true) {
    if (!this.usersLoaded() && noFetching) {
      noFetching = false;
      this.fetchUsers();
    }
    noFetching = true;
    return this.userData$.asObservable();
  }

  sharedProductData(noFetching: boolean = true) {
    if (!this.productsLoaded() && noFetching) {
      noFetching = false;
      this.fetchProducts();
    }
    noFetching = true;
    return this.productData$.asObservable();
  }

  getProductSnapshot(): product[] {
    return this.productData$.getValue(); // ✅ BehaviorSubject always has a current value
  }

  getUserSnapshot(): User[] {
    return this.userData$.getValue();
  }

  // 🔥 Public fetch triggers (better than constructor call)
  private fetchUsers() {
    this.usersLoaded.set(true);
    this.fetchData<User>(
      this.user_url,
      this.userData$,
      {
        success: this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Users fetched successfully!",
        empty: this.isRTL ? "کوئی صارف نہیں ملا!" : "No users found!",
        error: this.translateService.instant('Server Error!'),
      }
    );
  }

  private fetchProducts() {
    this.productsLoaded.set(true);
    this.fetchData<product>(
      this.product_url,
      this.productData$,
      {
        success: this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Products fetched successfully!",
        empty: this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No products found!",
        error: this.isRTL ? "ڈیٹا لینے میں ناکام!" : "Data fetching failed!"
      }
    );
  }

  // 🔥 Generic reusable method
  private fetchData<T>(
    url: string,
    subject: BehaviorSubject<T[]>,
    messages: { success: string; empty: string; error: string }
  ) {
    this.httpService.getApi(url)
      .pipe(
        take(1)
      )
      .subscribe({
        next: (res) => {
          const data = res.body ?? [];
          if (!data.length) {
            this.snackService.error(messages.empty, 2000, 'top-right');
          } else {
            this.snackService.success(messages.success, 2000, 'top-right');
          }
          subject.next(data);
        },
        error: () => {
          this.usersLoaded.set(false);
          this.productsLoaded.set(false);
          this.snackService.error(messages.error, 2000, 'top-right');
        }
      });
  }

  refreshData(
    type: 'users' | 'products',
    data: User[] | product[],
  ) {
    if (type === 'users') {
      this.userData$.next(data as User[]);
    } else {
      this.productData$.next(data as product[]);
    }
  }

  // Optional manual refresh
  // refreshUsers() {
  //   this.usersLoaded.set(false);
  //   this.fetchUsers();
  // }

  // refreshProducts() {
  //   this.productsLoaded.set(false);
  //   this.fetchProducts();
  // }
}