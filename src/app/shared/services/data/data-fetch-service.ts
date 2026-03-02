import { inject, Injectable, signal } from '@angular/core';
import { Loaderservice } from '../loader/loaderservice';
import { Router } from '@angular/router';
import { TranslationService } from '@app/core/services/translate.service';
import { Formservice } from '@app/features/users/adduser/services/formservice';
import { BehaviorSubject, finalize } from 'rxjs';
import { Httpservice } from '../httpservice/httpservice';
import { SnackBarService } from '../snackbar/snack-bar-service';
import { environment } from '@environments/environment.development';
import { User } from '@app/features/users/interface/user';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {

  isRTL: boolean;

  length = signal(0)

  url: string = environment.USER_URL;

  // userData: User[] = [];
  userData$ = new BehaviorSubject<User[]>([]);



  loaderService = inject(Loaderservice);
  private httpService = inject(Httpservice);
  private routerRef = inject(Router);
  private userFormService = inject(Formservice);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);

  constructor() {
    this.isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
  }

  shareUserData(){
    return this.userData$.asObservable();
  }

  getUserData() {
    this.loaderService.showLoader();
    this.httpService.getApi(this.url).pipe(
      finalize(() => {
        this.loaderService.hideLoader();
      })
    )
      .subscribe({
        next: (res) => {
          // console.log(res);
          if (!res.body) {
            this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
          }
          this.userData$ = res.body;
          this.length.set(this.userData$.value.length ?? 0);
          // this.length = this.userData.length ?? "error";
          this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
          // this.loaderService.hideLoader();
        },
        error: (err) => {
          // console.log(err);
          this.loaderService.hideLoader();
          this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
        },
      })
  }
}
