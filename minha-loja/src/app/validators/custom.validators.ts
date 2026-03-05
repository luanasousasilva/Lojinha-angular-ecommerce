import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static numeric: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const isValid = /^\d+$/.test(control.value);
    return isValid ? null : { numeric: true };
  };

  static phone: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const phonePattern = /^(\()?\d{2}(\))?\s?\d{4,5}-?\d{4}$/;
    const isValid = phonePattern.test(control.value.replace(/\s/g, ''));
    return isValid ? null : { phone: true };
  };

  static email: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(control.value);
    return isValid ? null : { email: true };
  };

  static expiryDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const pattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!pattern.test(control.value)) {
      return { expiryDate: true };
    }
    const [month, year] = control.value.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();

    return expiry > today ? null : { expiryDateExpired: true };
  };
}
