import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { environment } from '@environments/environment.development';
import { map } from 'rxjs';
import { credentials } from '../../interface/credentials';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { TranslationService } from '@app/core/services/translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from "@app/core/components/language-switcher/language-switcher.component";
import { Footer } from "@app/core/layouts/footer/footer";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NgClass, TranslateModule, LanguageSwitcherComponent, Footer],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {

  flag: boolean = false;
  isRTL: boolean;
  
  showPass = false;
  showCPass = false;

  email: string = '';
  color: string = '';
  password: string = '';
  cnfrmPassword: string = '';

  user!: credentials;

  authUrl = environment.AUTH_URL;

  routerRef = inject(Router);
  httpService = inject(Httpservice);
  snackService = inject(SnackBarService);
  loaderService = inject(Loaderservice);
  passwordService = inject(PasswordCheck);
  translationService = inject(TranslationService);

  constructor() {
    this.isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
  }

  get emailLengthGetter() {
    return this.email.length === 0 ? true : false;
  }

  get passwordLengthGetter() {
    return this.password.length === 0 ? true : false;
  }

  get cnfrmPasswordLengthGetter() {
    return this.cnfrmPassword.length === 0 ? true : false;
  }

  get passmatch() {
    return this.password === this.cnfrmPassword ? false : true;
  }

  get passwordStrengthGetter() {
    return this.passwordService.checkPasswordStrength(this.password);
  }

  get passwordStrengthColorGetter() {
    return this.passwordService.getPasswordStrengthColor(this.passwordStrengthGetter);
  }

  get passwordStrengthProgressGetter() {
    return this.passwordService.getPasswordStrengthProgress(this.passwordStrengthGetter);
  }

  checkEmail() {
    if (this.email.length <= 0) {
      this.snackService.warning(this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!", 5000, 'bottom-center');
    } else {
      this.loaderService.showLoader();
      this.httpService.getApi(this.authUrl).pipe(
        map(res => {
          const user: credentials = res.body.find(
            (u: credentials) => {
              if (u.email === this.email) {
                return u;
              } else {
                return;
              }
            }
          );
          // console.log(user);
          if (user) {
            return { success: true, user };
          } else {
            return { success: false, message: this.isRTL ? 'اس ای میل کے ساتھ کوئی اکاؤنٹ نہیں ملا!' : 'No account found with this email!' };
          }
        }),
      ).subscribe({
        next: (res) => {
          // console.log(res);
          if (res.success) {
            this.flag = true;
            this.email = '';
            this.user = res.user as credentials;
            // setTimeout(() => {
            //   this.snackService.success(this.isRTL ? 'اکاؤنٹ مل گیا!' : 'Account found!', 2000, 'top-center');
            // }, 2000);
          } else {
            this.snackService.error(`${res.message}`, 2000, 'top-center');
          }
          setTimeout(() => {
            this.snackService.success(this.isRTL ? 'اکاؤنٹ مل گیا!' : 'Account found!', 2000, 'top-center');
          }, 2000);
          this.loaderService.hideLoader();
        },
        error: (err) => {
          this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server error!", 2000, 'top-center');
          this.loaderService.hideLoader();
        }
      });
    }
  }

  passReset() {
    if (this.password.length <= 0) {
      this.snackService.warning(this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!", 5000, 'bottom-center');
    } else {
      // this.loaderService.showLoader();
      if (this.loaderService.isVisible$) {
        this.loaderService.hideLoader();
      } else {
        this.loaderService.showLoader();
      }
      this.user.password = this.password;
      const uId = this.user.id;
      this.httpService.editApi(this.authUrl, uId, this.user).subscribe({
        next: (res) => {
          // console.log(res);
          if (res) {
            this.flag = false;
            this.email = '';
            this.user = {} as credentials;
            this.snackService.success(this.isRTL ? "پاس ورڈ ری سیٹ کامیاب ہو گیا!" : "Password reset successfull!", 2000, 'top-center');
            this.loaderService.hideLoader();
            this.routerRef.navigate(['/auth/login']);
          } else {
            this.snackService.error(this.isRTL ? "کچھ غلط ہو گیا!" : "Something went wrong!", 2000, 'top-center');
          }
        },
        error: (err) => {
          this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server error!", 2000, 'top-center');
          this.loaderService.hideLoader();
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.flag = false;

    this.email = '';
    this.color = '';
    this.password = '';
    this.cnfrmPassword = '';

    this.user = {} as credentials;
  }
}
