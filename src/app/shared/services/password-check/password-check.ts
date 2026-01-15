import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordCheck {
  

  checkPasswordStrength(password: string) {
    // console.log("password strength called");

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
        return "Weak";
      case 3:
      case 4:
        return "Medium";
      case 5:
        return "Strong";
      default:
        return "Weak";
    }
  }

  getPasswordStrengthColor(val: string): string {
    switch (val) {
      case "Weak":
        return "text-red-500"
      case "Medium":
        return "text-orange-500"
      case "Strong":
        return "text-green-500"
      default:
        return "text-red-500"
    }
  }

  getPasswordStrengthProgress(val: string) {
    switch (val) {
      case "Weak":
        return "w-[35%] bg-red-500"
      case "Medium":
        return "w-[70%] bg-orange-500"
      case "Strong":
        return "w-[100%] bg-green-500"
      default:
        return "w-[0%] bg-transparent"
    }
  }

}
