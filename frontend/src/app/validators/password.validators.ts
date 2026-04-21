import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  /**
   * Validador que verifica se a password cumpre os requisitos:
   * - Mínimo 8 caracteres
   * - Pelo menos uma letra maiúscula
   * - Pelo menos uma letra minúscula
   * - Pelo menos um número
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const errors: ValidationErrors = {};

      // Verifica comprimento
      if (value.length < 8) {
        errors['minLength'] = true;
      }

      // Verifica letra maiúscula
      if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
      }

      // Verifica letra minúscula
      if (!/[a-z]/.test(value)) {
        errors['lowercase'] = true;
      }

      // Verifica número
      if (!/\d/.test(value)) {
        errors['number'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validador que verifica se duas passwords coincidem
   */
  static passwordMatch(passwordField: string, confirmField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirm = control.get(confirmField);

      if (!password || !confirm) {
        return null;
      }

      return password.value === confirm.value ? null : { passwordMismatch: true };
    };
  }
}

export class DateValidators {
  /**
   * Validador que verifica se o utilizador tem pelo menos 13 anos
   */
  static minAge(minYears: number = 13): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const birthDate = new Date(value);

      // Verifica se a data é válida
      if (isNaN(birthDate.getTime())) {
        return { invalidDate: true };
      }

      const today = new Date();

      // Não pode ser data futura
      if (birthDate > today) {
        return { futureDate: true };
      }

      // Calcula a idade
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age -= 1;
      }

      return age >= minYears ? null : { minAge: { requiredAge: minYears, actualAge: age } };
    };
  }
}

