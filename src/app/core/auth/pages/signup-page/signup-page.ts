import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { matchPasswordValidator } from '@app/shared/validators/match-password.validator';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NgClass],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {

  AuthURL: string = environment.AUTH_URL;

  private routerRef = inject(Router);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private passwordService = inject(PasswordCheck);


  signupForm: FormGroup;

  constructor() {
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
  }

  get f() {
    return this.signupForm.controls;
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

  
  get passwordStrengthGetter() {
    return this.passwordService.checkPasswordStrength(this.password?.value);
  }

  get passwordStrengthColorGetter() {
    return this.passwordService.getPasswordStrengthColor(this.passwordStrengthGetter);
  }

  get passwordStrengthProgressGetter() {
    return this.passwordService.getPasswordStrengthProgress(this.passwordStrengthGetter);
  }

  onSignupSubmit() {
    this.loaderService.showLoader();
    this.httpService.addApi(this.AuthURL, this.signupForm.value).subscribe({
      next: (res) => {
        // console.log(res);
        this.snackService.success("Account created successfully!", 2000, 'bottom-center');
        this.loaderService.hideLoader();
        this.routerRef.navigate(['/login']);
      },
      error: (err) => {
        // console.log(err);
        this.snackService.error("Server Error no user created!", 2000, 'bottom-center');
        this.loaderService.hideLoader();
      }
    })
  }

}
