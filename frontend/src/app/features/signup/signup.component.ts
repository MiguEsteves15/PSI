import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PasswordValidators, DateValidators } from '../../validators/password.validators';

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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
        email: ['', [Validators.required, Validators.email]],
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
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        }
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
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signupForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (fieldName) {
      case 'username':
        if (control.errors['required']) return 'Username é obrigatório';
        if (control.errors['pattern'])
          return 'Username só pode conter letras e números';
        break;
      case 'email':
        if (control.errors['required']) return 'Email é obrigatório';
        if (control.errors['email']) return 'Email inválido';
        break;
      case 'password':
        if (control.errors['required']) return 'Password é obrigatória';
        if (control.errors['minLength'])
          return 'Password deve ter pelo menos 8 caracteres';
        if (control.errors['uppercase'])
          return 'Password deve incluir uma letra maiúscula';
        if (control.errors['lowercase'])
          return 'Password deve incluir uma letra minúscula';
        if (control.errors['number'])
          return 'Password deve incluir um número';
        break;
      case 'confirmPassword':
        if (control.errors['required'])
          return 'Confirmação de password é obrigatória';
        break;
      case 'dataNascimento':
        if (control.errors['required'])
          return 'Data de nascimento é obrigatória';
        if (control.errors['invalidDate'])
          return 'Data inválida';
        if (control.errors['futureDate'])
          return 'A data de nascimento não pode ser no futuro';
        if (control.errors['minAge'])
          return `Deve ter pelo menos ${control.errors['minAge'].requiredAge} anos`;
        break;
    }

    return '';
  }
}
