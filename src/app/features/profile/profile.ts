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
import { BehaviorSubject, debounceTime, delay, fromEvent, map, timeout } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '@app/core/components/language-switcher/language-switcher.component';
import { TranslationService } from '@app/core/services/translate.service';

export interface profilesociallinkbtns {
  alt: string,
  profile: string,
}

@Component({
  selector: 'app-profile',
  imports: [NgClass, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  isRTL: boolean;

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
  private translationService = inject(TranslationService);

  constructor() {
    this.isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
    this.profileForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl('', [customEmailValidator]),
      password: new FormControl(''),
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
    if (this.profileForm.pristine) {
      return true;
    } else {
      return false;
    }
    // if (this.profileForm.touched) {
    //   return true;
    // } else if (this.passcnfrm === false) {
    //   // if (this.passcnfrm === false) {
    //   //   return true;
    //   // }
    //   return false;
    // } else if (this.message !== '') {
    //   return true;
    // } else {
    //   return false;
    // }
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
      password: this.user?.password,
    });
  }

  passcheck() {
    // debounceTime(1000);
    // console.log(this.oldpass);

    // setTimeout(() => {
    if (this.oldpass.length >= 3 || this.oldpass.length === 0) {

      this.loader.set(true),
        this.httpService.getApi(this.URL).pipe(
          delay(600),
          map(res => {
            const state = res.body.some(
              (u: credentials) => u.password === this.oldpass
            );
            // const state: boolean = res.body.find(
            //   // (u: credentials) => u.email === this.email?.value
            //   (u: credentials) => {
            //     if (u.password === this.oldpass) {
            //       return true;
            //     } else {
            //       return false;
            //     }
            //   }
            // );
            // console.log(state);
            if (state) {
              return true;
            } else {
              return false;
            }
          }),
        ).subscribe({
          next: (res) => {
            // console.log(res);
            if (res) {
              this.message = "";
            } else {
              if(this.isRTL){
                this.message = "غلط پاس ورڈ";
              } else {
                this.message = "Wrong Password";
              }
            }
            this.loader.set(false);
          },
          error: (err) => {
            if(this.isRTL){
              this.message = "سرور کی خرابی!";
            } else {  
              this.message = "Server error!";
            }
            this.loader.set(false);
          }
        });
    }
    // }, 1000);
  }

  onPassChange() {
    // console.log(password?.value);
    // console.log(passwordStrengthGetter);
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

  onReset() {
    // this.profileForm.pas;
    this.patchValues();
    // this.password?.reset();
    this.message = '';
    this.oldpass = "";
    this.cnfrmpass = "";
  }

  onSubmit() {
    // console.log(this.profileForm.value);
    // console.log(this.user);
    const id = this.user!.id.toString();
    this.profileForm.patchValue({
      status: this.user?.status,
      role: this.user?.role
    });
    // console.log(this.profileForm.value);
    this.httpService.editApi(this.URL, id, this.profileForm.value).subscribe({
      next: (res) => {
        // console.log(res);
        this.authService.login(res, true);
        this.snackService.success(this.isRTL ? "پروفائل کامیابی سے اپ ڈیٹ ہو گیا!" : "Profile edited", 2000, 'top-center');
      },
      error: (err) => {
        // console.log(err);
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server error", 2000, 'top-center');
      }
    }
    );
  }

  onDelete() {
    const isRTL = this.isRTL;
    this.dialogService.open({
      actbtn: isRTL ? 'حذف کریں' : 'Delete',
      title: isRTL ? '⚠️ حذف کرنے کی انتباہ' : '⚠️ Delete Alert',
      message: isRTL ? 'کیا آپ واقعی اپنے اکاؤنٹ کو حذف کرنا چاہتے ہیں؟ حذف کرنے کے بعد اکاؤنٹ بحال نہیں ہو سکتا۔' : 'Are you sure you want to delete your account. After deletion account is not recoverable.',
      type: 'generic'
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
    // clearTimeout();
  }
}
