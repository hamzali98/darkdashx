import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment.development';
import { AuthInputConfigs } from '@app/core/auth/shared/configs/config';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { PageDesign } from "../../shared/components/auth-design/auth-design";
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { SubmitButton } from "@app/shared/components/submit-button/submit-button";
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { matchPasswordValidator } from '@app/shared/validators/match-password.validator';
import { AuthFormFooter } from "../../shared/components/auth-form-footer/auth-form-footer";
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, GenericInput, PageDesign, SubmitButton, AuthFormFooter],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {

  showPass = false;
  showCPass = false;

  signupPageTitle: string;
  signupPageSubtitle: string;
  signupBtnText: string;

  loginLinkLabel: string;
  loginLinkRoute: string;
  loginLinkText: string;

  AuthURL: string = environment.AUTH_URL;

  userNameConfig: CustomInputConfig;
  emailConfig: CustomInputConfig;
  passwordConfig: CustomInputConfig;
  confirmPasswordConfig: CustomInputConfig;

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private passwordService = inject(PasswordCheck);
  private translateService = inject(TranslateService);

  signupForm: FormGroup;

  constructor() {
    this.signupPageTitle = "Create Account";
    this.signupPageSubtitle = "Please fill in your Details to create account";
    this.signupBtnText = "Create Account";
    this.loginLinkLabel = "Already have an account?";
    this.loginLinkRoute = "/auth/login";
    this.loginLinkText = "LOGIN";

    this.signupForm = new FormGroup({
      username: new FormControl("", [Validators.required, Validators.maxLength(15), Validators.minLength(6)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      c_password: new FormControl("", Validators.required),
      status: new FormControl(false),
      role: new FormControl("user"),
    },
      {
        validators: matchPasswordValidator('password', 'c_password')
      }
    );
    this.signupForm.markAllAsTouched();

    this.userNameConfig = new AuthInputConfigs().userName;
    this.emailConfig = new AuthInputConfigs().email;
    this.passwordConfig = new AuthInputConfigs().password;
    this.confirmPasswordConfig = new AuthInputConfigs().confirmPassword;
  }

  get f() {
    return this.signupForm.controls;
  }

  get sigupBtnDisabled() {
    return this.signupForm.invalid;
  }

  get username() {
    return this.signupForm.get("username");
  }

  get email() {
    return this.signupForm.get("email");
  }

  get password() {
    return this.signupForm.get("password");
  }

  get c_password() {
    return this.signupForm.get("c_password");
  }


  get passwordStrengthGetter(): string {
    return this.passwordService.checkPasswordStrength(this.password?.value);
  }

  get passwordStrengthColorGetter(): string {
    return this.passwordService.getPasswordStrengthColor(this.passwordStrengthGetter);
  }

  get passwordStrengthProgressGetter(): string {
    return this.passwordService.getPasswordStrengthProgress(this.passwordStrengthGetter);
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      this.snackService.warning(this.translateService.instant("Please fill in all required fields!"), 5000, 'bottom-center');
    } else {
      this.loaderService.showLoader();
      this.httpService.addApi(this.AuthURL, this.signupForm.value).subscribe({
        next: (res) => {
          this.snackService.success(this.translateService.instant("Account created successfully!"), 2000, 'bottom-center');
          this.loaderService.hideLoader();
          this.routerRef.navigate(['/auth/login']);
        },
        error: (err) => {
          this.snackService.error(this.translateService.instant("Server Error!"), 2000, 'bottom-center');
          this.loaderService.hideLoader();
        }
      })
    }
  }

}
