// match-password.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Custom validator function that checks if two specified controls have the same value.
 *
 * @param controlName The name of the first control (e.g., 'password').
 * @param matchingControlName The name of the second control (e.g., 'confirmPassword').
 * @returns A ValidatorFn that can be applied to a FormGroup.
 */
export function matchPasswordValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  // Return the actual validator function
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    // 1. Get the controls from the FormGroup
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    // 2. Check for missing controls (safety check)
    if (!control || !matchingControl) {
      // If controls are missing, don't perform validation and return null
      return null;
    }

    // 3. Skip validation if the matching control is null (e.g., if another field's error prevents it from being defined)
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    // 4. Perform the comparison
    if (control.value !== matchingControl.value) {
      // Set the error on the matchingControl
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true }; // Optionally return an error object on the form group as well
    } else {
      // Remove the error if the values match
      matchingControl.setErrors(null);
      return null;
    }
  };
}