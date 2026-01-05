import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { credentials } from '@app/core/auth/interface/credentials';
import { AuthService } from '@app/core/auth/services/auth-service';
import { customEmailValidator } from '@app/shared/utils/email-validator';

export interface profilesociallinkbtns {
  alt: string,
  profile: string,
}

@Component({
  selector: 'app-profile',
  imports: [NgClass, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  emailOn = false;
  smsOn = false;
  tfaOn = false;

  profileSocialBtnsLinks: profilesociallinkbtns[];
  user!: credentials | null;
  profileForm: FormGroup;

  private authService = inject(AuthService);
  private routerRef = inject(Router);

  constructor() {
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
    this.profileForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, customEmailValidator]),
    })
  }

  get username() {
    return this.profileForm.get('username');
  }

  get email() {
    return this.profileForm.get('email');
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.user = this.authService.getUser();
    // this.profileForm.patchValue({
    //   username: this.user?.username,
    //   email: this.user?.email,
    // });
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

  onLogout() {
    this.authService.logout();
    this.routerRef.navigate(["/login"]);
  }
}
