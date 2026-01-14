import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { credentials } from '@app/core/auth/interface/credentials';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { customEmailValidator } from '@app/shared/validators/email-validator';
import { environment } from '@environments/environment.development';
import { BehaviorSubject, debounceTime, fromEvent, map, timeout } from 'rxjs';

export interface profilesociallinkbtns {
  alt: string,
  profile: string,
}

@Component({
  selector: 'app-profile',
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {

  smsOn = false;
  tfaOn = false;
  emailOn = false;
  loader = signal<boolean>(false);

  URL = environment.AUTH_URL;

  message: string = "";
  oldpass: string = "";
  cnfrmpass: string = "";

  profileSocialBtnsLinks: profilesociallinkbtns[];
  user!: credentials | null;
  profileForm: FormGroup;

  private routerRef = inject(Router);
  private authService = inject(AuthService);
  private httpService = inject(Httpservice);
  private dialogService = inject(DialogService);
  private passwordService = inject(PasswordCheck);
  private snackService = inject(SnackBarService);

  constructor() {
    this.profileForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [customEmailValidator]),
      password: new FormControl('', Validators.required),
      status: new FormControl(false),
      role: new FormControl(""),
    });
    this.profileSocialBtnsLinks = [
      { alt: "f", profile: "assets/logos/facebook.svg" },
      { alt: "g", profile: "assets/logos/google.svg" },
      { alt: "l", profile: "assets/logos/linkedin.svg" },
      { alt: "p", profile: "assets/logos/pinterest.svg" },
      { alt: "r", profile: "assets/logos/reddit.svg" },
      { alt: "s", profile: "assets/logos/spotify.svg" },
      { alt: "t", profile: "assets/logos/twitter.svg" },
      { alt: "y", profile: "assets/logos/youtube.svg" },
    ];

  }

  get username() {
    return this.profileForm.get('username');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get password() {
    return this.profileForm.get('password');
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

  get passcnfrm() {
    return this.cnfrmpass === this.password?.value ? true : false;
  }

  get btndisableGetter() {
    if (this.profileForm.invalid) {
      return true;
    } else if (this.passcnfrm === false) {
      return true;
    } else if (this.message !== '') {
      return true;
    } else {
      return false;
    }
    // return profileForm.invalid && passcnfrm === false && message !== ''
  }

  ngOnInit(): void {
    this.getData();
    this.patchValues();
  }

  getData() {
    this.user = this.authService.getUser();
  }

  patchValues() {
    this.profileForm.patchValue({
      username: this.user?.username,
      email: this.user?.email,
    });
  }

  passcheck() {
    // debounceTime(1000);
    console.log(this.oldpass);
    
    setTimeout(() => {
      this.loader.set(true);

    this.httpService.getApi(this.URL).pipe(
      // debounceTime(3000),
      map(res => {
        const state: boolean = res.body.find(
          // (u: credentials) => u.email === this.email?.value
          (u: credentials) => {
            if (u.password === this.oldpass) {
              return true;
            } else {
              return false;
            }
          }
        );
        console.log(state);
        if (state) {
          return true;
        } else {
          return false;
        }
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.message = "";
        } else {
          this.message = "Wrong Password"
        }
        this.loader.set(false);
      },
      error: (err) => {
        this.message = "Server error!";
        this.loader.set(false);
      }
    })
    }, 1000);
  }

  toggle(action: string) {
    switch (action) {
      case "email":
        this.emailOn = !this.emailOn;
        return;
      case "sms":
        this.smsOn = !this.smsOn;
        return;
      case "2fa":
        this.tfaOn = !this.tfaOn;
        return;
      default:
        return;
    }
    // this.isOn = !this.isOn;
  }

  onReset(){
    // this.profileForm.pas;
    this.patchValues();
    this.password?.reset();
    this.message = '';
    this.oldpass = "";
    this.cnfrmpass = "";
  }

  onSubmit() {
    console.log(this.profileForm.value);
    console.log(this.user);
    const id = this.user!.id.toString();
    this.profileForm.patchValue({
      status: this.user?.status,
      role: this.user?.role
    });
    console.log(this.profileForm.value);
    this.httpService.editApi(this.URL, id, this.profileForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.authService.login(res, true);
        this.snackService.success("Profile edited", 2000, 'top-center');
      },
      error: (err) => {
        console.log(err);
        this.snackService.error("Server error", 2000, 'top-center');
      }
    }
    );
  }

  onDelete() {
    this.dialogService.open({
      title: '⚠️ Delete Alert',
      content: 'Are you sure you want to delete your account. After deletion account is not recoverable.',
      type: 'generic' // Custom type for styling/logic in app.component
    });
  }

  ngOnDestroy(): void {
    this.loader = signal<boolean>(false);
    this.emailOn = false;
    this.smsOn = false;
    this.tfaOn = false;

    this.message = "";
    this.oldpass = "";
    this.cnfrmpass = "";
    this.user = {} as credentials | null;
    this.profileForm.reset;
  }
}
