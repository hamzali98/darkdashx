import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordCheck {

  private translateService = inject(TranslateService);

  constructor() { }

  checkPasswordStrength(password: string) {

    const lengthRegex = /.{8}/;
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*()_+=\[{\]};:<>|./?,-]/;

    let score = 0;

    if (lengthRegex.test(password)) score++;
    if (upperRegex.test(password)) score++;
    if (lowerRegex.test(password)) score++;
    if (numberRegex.test(password)) score++;
    if (specialRegex.test(password)) score++;

      switch (score) {
        case 0:
        case 1:
          return this.translateService.instant("Weak");
        case 3:
        case 4:
          return this.translateService.instant("Medium");
        case 5:
          return this.translateService.instant("Strong");
        default:
          return this.translateService.instant("Weak");
      }
  }

  getPasswordStrengthColor(val: string): string {
      switch (val) {
        case this.translateService.instant("Weak"):
          return "text-red-500"
        case this.translateService.instant("Medium"):
          return "text-orange-500"
        case this.translateService.instant("Strong"):
          return "text-green-500"
        default:
          return "text-red-500"
      }
  }

  getPasswordStrengthProgress(val: string) {
      switch (val) {
        case this.translateService.instant("Weak"):
          return "w-[35%] bg-red-500"
        case this.translateService.instant("Medium"):
          return "w-[70%] bg-orange-500"
        case this.translateService.instant("Strong"):
          return "w-[100%] bg-green-500"
        default:
          return "w-[0%] bg-transparent"
      }
    }

}
