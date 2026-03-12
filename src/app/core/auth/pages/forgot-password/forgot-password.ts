import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { environment } from '@environments/environment.development';
import { map } from 'rxjs';
import { credentials } from '../../interface/credentials';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageDesign } from "../../shared/components/auth-design/auth-design";
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { AuthInputConfigs } from '../../shared/configs/config';
import { SubmitButton } from "@app/shared/components/submit-button/submit-button";
import { AuthFormFooter } from "../../shared/components/auth-form-footer/auth-form-footer";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, PageDesign, GenericInput, SubmitButton, AuthFormFooter],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {

  flag: boolean = false;
  // isRTL: boolean;
  showPass: boolean = false;
  showCPass: boolean = false;

  forgotPasswordPageTitle1: string;
  forgotPasswordPageSubtitle1: string;
  forgotPasswordPageTitle2: string;
  forgotPasswordPageSubtitle2: string;
  loginLinkLabel: string;
  loginLinkRoute: string;
  loginLinkText: string;
  findAccountBtnText: string;
  passResetbtnText: string;

  email: string = '';
  color: string = '';
  password: string = '';
  cnfrmPassword: string = '';

  forgotEmailConfig: CustomInputConfig;
  forgotPasswordConfig: CustomInputConfig;
  forgotConfirmPasswordConfig: CustomInputConfig;

  user!: credentials;

  authUrl = environment.AUTH_URL;

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private loaderService = inject(Loaderservice);
  private passwordService = inject(PasswordCheck);
  private translateService = inject(TranslateService);

  constructor() {
    this.forgotPasswordPageTitle1 = "Find Account";
    this.forgotPasswordPageSubtitle1 = "Please enter your account accociated email to reset password.";
    this.forgotPasswordPageTitle2 = "Reset Password";
    this.forgotPasswordPageSubtitle2 = "Please enter your new password for account.";
    this.findAccountBtnText = "Find Account?";
    this.loginLinkLabel = "Already have an account?";
    this.loginLinkRoute = "/auth/login";
    this.loginLinkText = "LOGIN";
    this.passResetbtnText = "Reset Password";

    this.forgotEmailConfig = new AuthInputConfigs().email;
    this.forgotPasswordConfig = new AuthInputConfigs().password;
    this.forgotConfirmPasswordConfig = new AuthInputConfigs().confirmPassword;
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
      this.snackService.warning(this.translateService.instant("Please fill in all required fields!"), 5000, 'bottom-center');
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
            return { success: false, message: this.translateService.instant('No account found with this email!') };
          }
        }),
      ).subscribe({
        next: (res) => {
          // console.log(res);
          if (res.success) {
            this.flag = true;
            this.email = '';
            this.user = res.user as credentials;
          } else {
            this.snackService.error(`${res.message}`, 2000, 'top-center');
          }
          setTimeout(() => {
            this.snackService.success(this.translateService.instant('Account found!'), 2000, 'top-center');
          }, 2000);
          this.loaderService.hideLoader();
        },
        error: (err) => {
          this.snackService.error(
            this.translateService.instant('Server Error!'), 2000, 'top-center');
          this.loaderService.hideLoader();
        }
      });
    }
  }

  passReset() {
    if (this.password.length <= 0) {
      this.snackService.warning(this.translateService.instant("Please fill in all required fields!"), 5000, 'bottom-center');
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
            this.snackService.success(this.translateService.instant("Password reset successfull!"), 2000, 'top-center');
            this.loaderService.hideLoader();
            this.routerRef.navigate(['/auth/login']);
          } else {
            this.snackService.error(this.translateService.instant("Something went wrong!"), 2000, 'top-center');
          }
        },
        error: (err) => {
          this.snackService.error(
            this.translateService.instant('Server Error!'),
            2000, 'top-center');
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
