import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PasswordValidators, DateValidators } from '../../validators/password.validators';

const BASIC_EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;

type ErrorRule = {
  key: string;
  message: string | ((errors: Record<string, any>) => string);
};

const FIELD_ERROR_RULES: Record<string, ErrorRule[]> = {
  username: [
    { key: 'required', message: 'Username é obrigatório' },
    { key: 'pattern', message: 'Username só pode conter letras e números' }
  ],
  email: [
    { key: 'required', message: 'Email é obrigatório' },
    { key: 'pattern', message: 'Email inválido' }
  ],
  password: [
    { key: 'required', message: 'Password é obrigatória' },
    { key: 'minLength', message: 'Password deve ter pelo menos 8 caracteres' },
    { key: 'uppercase', message: 'Password deve incluir uma letra maiúscula' },
    { key: 'lowercase', message: 'Password deve incluir uma letra minúscula' },
    { key: 'number', message: 'Password deve incluir um número' }
  ],
  confirmPassword: [
    { key: 'required', message: 'Confirmação de password é obrigatória' }
  ],
  dataNascimento: [
    { key: 'required', message: 'Data de nascimento é obrigatória' },
    { key: 'invalidDate', message: 'Data inválida' },
    { key: 'futureDate', message: 'A data de nascimento não pode ser no futuro' },
    {
      key: 'minAge',
      message: (errors) => `Deve ter pelo menos ${errors['minAge'].requiredAge} anos`
    }
  ]
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  maxBirthDate = this.calculateMaxBirthDate();

  passwordRequirements = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  private calculateMaxBirthDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
        email: ['', [Validators.required, Validators.pattern(BASIC_EMAIL_REGEX)]],
        password: ['', [Validators.required, PasswordValidators.strongPassword()]],
        confirmPassword: ['', Validators.required],
        dataNascimento: ['', [Validators.required, DateValidators.minAge(13)]]
      },
      { validators: PasswordValidators.passwordMatch('password', 'confirmPassword') }
    );

    // Monitor password changes to update requirements
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordRequirements();
    });
  }

  private updatePasswordRequirements(): void {
    const password = this.signupForm.get('password')?.value || '';

    this.passwordRequirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Por favor preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password, dataNascimento } = this.signupForm.value;

    this.authService.register({
      username,
      email,
      password,
      dataNascimento: new Date(dataNascimento).toISOString()
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Conta criada com sucesso!';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        // Tentar extrair mensagem do erro de várias formas
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else {
          console.error('Erro completo:', error);
          this.errorMessage = 'Erro ao criar a conta. Tente novamente.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signupForm.get(fieldName);

    if (!control?.errors || !control.touched) {
      return '';
    }

    const rules = FIELD_ERROR_RULES[fieldName] || [];
    for (const rule of rules) {
      if (control.errors[rule.key]) {
        if (typeof rule.message === 'function') {
          return rule.message(control.errors);
        }
        return rule.message;
      }
    }

    return '';
  }
}
