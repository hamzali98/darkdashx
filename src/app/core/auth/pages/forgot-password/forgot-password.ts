import { Component, inject, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NgClass],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {

  flag: boolean = false;

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
    this.loaderService.showLoader();
    this.httpService.getApi(this.authUrl).pipe(
      map(res => {
        const user: credentials = res.body.find(
          // (u: credentials) => u.email === this.email?.value
          (u: credentials) => {
            if (u.email === this.email) {
              return u;
            } else {
              return;
            }
          }
        );
        console.log(user);
        if (user) {
          return { success: true, user };
        } else {
          return { success: false, message: 'No account found with this email!' };
        }
      }),
    ).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.flag = true;
          this.email = '';
          this.user = res.user as credentials;
          this.snackService.success("Account found!", 2000, 'top-center');
        } else {
          this.snackService.error(`${res.message}`, 2000, 'top-center');
        }
        this.loaderService.hideLoader();
      },
      error: (err) => {
        this.snackService.error("Server error!", 2000, 'top-center');
        this.loaderService.hideLoader();
      }
    });
  }

  passReset() {
    this.loaderService.showLoader();
    this.user.password = this.password;
    const uId = this.user.id;
    this.httpService.editApi(this.authUrl, uId, this.user).subscribe({
      next: (res) => {
        console.log(res);
        this.flag = true;
        this.email = '';
        this.user = {} as credentials;
        this.snackService.success("Password reset successfull!", 2000, 'top-center');
        this.loaderService.hideLoader();
        this.routerRef.navigate(['/login']);
      },
      error: (err) => {
        this.snackService.error("Server error!", 2000, 'top-center');
        this.loaderService.hideLoader();
      }
    });
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
