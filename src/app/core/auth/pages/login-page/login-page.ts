import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { environment } from '@environments/environment.development';
import { finalize, map } from 'rxjs';
import { credentials } from '../../interface/credentials';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  data: credentials[] = [];

  loginForm: FormGroup;

  authUrl = environment.AUTH_URL;

  remember: boolean = false;

  private httpService = inject(Httpservice);
  private snackService = inject(SnackBarService);
  private loaderService = inject(Loaderservice);
  private routerRef = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    this.loginForm.markAllAsTouched();
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password")
  }

  onLoginSubmit() {
    this.loaderService.showLoader();

    this.httpService.getApi(this.authUrl).pipe(
      map(res => {
        const user = res.body.find(
          (u: credentials) => {
            if (u.email === this.email?.value && u.password === this.password?.value) {
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
          return { success: false, message: 'Email or Password Incorrect!' };
        }
      }),
    ).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.success) {
          // console.log(res);
          this.authService.login(res.user, this.remember);
          this.routerRef.navigate(["/"]);
          if (this.remember) {

          }
          this.snackService.success("Login successfull!", 2000, 'top-center');
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
          "Server Error!",
          2000,
          'top-center'
        );
        this.loaderService.hideLoader();
      }
    });

  }

}
