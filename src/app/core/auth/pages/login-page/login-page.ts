import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { environment } from '@environments/environment.development';
import { map } from 'rxjs';
import { credentials } from '../../interface/credentials';
import { AuthService } from '../../services/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageDesign } from "../../shared/components/auth-design/auth-design";
import { SubmitButton } from "@app/shared/components/submit-button/submit-button";
import { AuthFormFooter } from "../../shared/components/auth-form-footer/auth-form-footer";
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { AuthInputConfigs } from '../../shared/configs/config';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, TranslateModule, PageDesign, SubmitButton, AuthFormFooter, GenericInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  showPass = false;
  remember: boolean = false;

  loginPageTitle: string;
  loginPageSubtitle: string;
  loginBtnText: string;
  signupLinkLabel: string;
  signupLinkRoute: string;
  signupLinkText: string;

  emailInputConfig: CustomInputConfig;
  passwordInputConfig: CustomInputConfig;
  rememberMe: CustomInputConfig;

  data: credentials[];
  loginForm: FormGroup;

  authUrl = environment.AUTH_URL;


  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private loaderService = inject(Loaderservice);
  private routerRef = inject(Router);
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);
  private tickService = inject(TickAnimationService);


  constructor() {
    this.loginPageTitle = "LOGIN";
    this.loginPageSubtitle = "LOGIN_DESC";
    this.loginBtnText = "LOGIN";
    this.signupLinkLabel = "NO_ACCOUNT";
    this.signupLinkRoute = "/auth/signup";
    this.signupLinkText = "CREATE";

    this.emailInputConfig = new AuthInputConfigs().loginEmail;
    this.passwordInputConfig = new AuthInputConfigs().loginPassword;
    this.rememberMe = new AuthInputConfigs().rememberMe;

    this.data = [];
    this.loginForm = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    this.loginForm.markAllAsTouched();
  }

  get btnDisabled() {
    return this.loginForm.invalid;
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password")
  }

  get emailHasError(): boolean {
    return !!this.email?.hasError('required') && this.email?.touched;
  }

  get emailValid(): boolean {
    return !!this.email?.valid;
  }

  get passwordHasError(): boolean {
    return !!this.password?.hasError('required') && this.password?.touched;
  }

  get passwordValid(): boolean {
    return !!this.password?.valid;
  }

  onRemember() {
    // console.log("On Remember", this.remember);
    this.remember = !this.remember;
    // console.log("Remember", this.remember);
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.snackService.warning(this.translateService.instant("Please fill in all required fields!"), 5000, 'bottom-center');
    } else {

      this.loaderService.showLoader();
      this.httpService.getApi(this.authUrl).pipe(
        map(res => {
          const user = res.body.find(
            (u: credentials) => {
              if (u.email === this.email?.value && u.password === this.password?.value) {
                u.password = "****";
                u.c_password = "****";
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
            return { success: false, message: this.translateService.instant('Email or Password Incorrect!') };
          }
        }),
      ).subscribe({
        next: (res) => {
          // console.log(res);
          if (res.success) {
            // console.log(res);
            this.authService.login(res.user, this.remember);
            setTimeout(() => {
              this.tickService.show("Login successfull!", 2000);
              setTimeout(() => {
                this.routerRef.navigate(["/"]);
              }, 1000);
            }, 1000);
            // this.snackService.success(this.translateService.instant("Login successfull!"), 2000, 'top-center');
          } else {
            this.snackService.error(
              `${res.message}`,
              2000,
              'top-center'
            );
          }
          this.loaderService.hideLoader();
        },
        error: (err) => {
          console.error(err);
          this.snackService.error(
            this.translateService.instant('Server Error!'),
            2000,
            'top-center'
          );
          this.loaderService.hideLoader();
        }
      });
    }
  }

}
