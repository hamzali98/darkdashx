import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customEmailValidator (control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(control.value)
    ? null
    : { customEmail: true };
}
