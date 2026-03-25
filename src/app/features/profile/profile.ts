import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { credentials } from '@app/core/auth/interface/credentials';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { PasswordCheck } from '@app/shared/services/password-check/password-check';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { customEmailValidator } from '@app/shared/validators/email-validator';
import { environment } from '@environments/environment.development';
import { delay, map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@app/core/services/translate.service';
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';
import { CustomInputConfig, GenericInput } from "@app/shared/components/generic-input/generic-input";
import { ProfileConfig } from './config';

export interface profilesociallinkbtns {
  alt: string,
  profile: string,
}

@Component({
  selector: 'app-profile',
  imports: [NgClass, ReactiveFormsModule, FormsModule, TranslateModule, TooltipDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {

  showOldPass = false;
  showPass = false;
  showCPass = false;

  smsOn = false;
  tfaOn = false;
  emailOn = false;
  loader = signal<boolean>(false);

  URL = environment.AUTH_URL;

  message: string = "";
  oldpass: string = "";
  cnfrmpass: string = "";

  usernameInputConfig: CustomInputConfig;
  emailInputConfig: CustomInputConfig;
  profileSocialBtnsLinks: profilesociallinkbtns[];
  user!: credentials | null;
  profileForm: FormGroup;

  private authService = inject(AuthService);
  private httpService = inject(Httpservice);
  private dialogService = inject(DialogService);
  private passwordService = inject(PasswordCheck);
  private snackService = inject(SnackBarService);
  private tickAnimationService = inject(TickAnimationService);
  private translateService = inject(TranslateService);

  constructor() {
    this.profileForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl('', [customEmailValidator]),
      password: new FormControl(''),
      status: new FormControl(false),
      role: new FormControl(""),
    });
    this.profileSocialBtnsLinks = [
      { alt: "Facebook", profile: "assets/logos/facebook.svg" },
      { alt: "Google", profile: "assets/logos/google.svg" },
      { alt: "Linkedin", profile: "assets/logos/linkedin.svg" },
      { alt: "Pinterest", profile: "assets/logos/pinterest.svg" },
      { alt: "Reddit", profile: "assets/logos/reddit.svg" },
      { alt: "Spotify", profile: "assets/logos/spotify.svg" },
      { alt: "Twitter", profile: "assets/logos/twitter.svg" },
      { alt: "Youtube", profile: "assets/logos/youtube.svg" },
    ];


    this.usernameInputConfig = new ProfileConfig().usernameInputConfig;
    this.emailInputConfig = new ProfileConfig().emailInputConfig;
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
              this.message = this.translateService.instant("Wrong Password");
            }
            this.loader.set(false);
          },
          error: (err) => {
            this.message = this.translateService.instant('Server Error!');
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
    if (this.profileForm.invalid) {
      this.snackService.warning(this.translateService.instant("Please fill in all required fields!"), 5000, 'bottom-center');
    } else {

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
          this.snackService.success(this.translateService.instant("Profile edited"), 2000, 'top-center');
        },
        error: (err) => {
          // console.log(err);
          this.snackService.error(this.translateService.instant('Server Error!'), 2000, 'top-center');
        }
      }
      );
    }
  }

  onDelete() {
    this.dialogService.open({
      actbtn: this.translateService.instant('DELETE'),
      title: `⛔ ${this.translateService.instant('Delete Alert')}`,
      message: this.translateService.instant('Delete_alert_msg'),
      type: 'generic'
    }).subscribe((res) => {
      if (res) {
        this.tickAnimationService.show(this.translateService.instant("Deleted!"), 2000);
      }
    })
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
