import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable, of, BehaviorSubject, switchMap, take } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

const BASIC_EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;

interface Artist {
  _id: string;
  nome: string;
}

interface UserProfile {
  username: string;
  email: string;
  dataNascimento: string;
  artistaFavorito?: Artist | null;
}

interface ProfileState {
  loading: boolean;
  profile: UserProfile | null;
  error: string;
}

function passwordsMatch(group: AbstractControl): { passwordMismatch: true } | null {
  const newPwd = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return newPwd === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly state$: Observable<ProfileState> = this.refresh$.pipe(
    switchMap(() =>
      this.userService.getProfile().pipe(
        map((response): ProfileState => ({
          loading: false,
          profile: response.success ? response.data.user : null,
          error: response.success ? '' : 'Não foi possível carregar o perfil.'
        })),
        catchError(() => of<ProfileState>({ loading: false, profile: null, error: 'Erro ao carregar o perfil. Tente novamente.' })),
        startWith<ProfileState>({ loading: true, profile: null, error: '' })
      )
    )
  );

  showEdit = false;

  readonly usernameForm = this.fb.group({
    newUsername: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
    currentPassword: ['', Validators.required]
  });

  readonly emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(BASIC_EMAIL_REGEX)]],
    currentPassword: ['', Validators.required]
  });

  readonly birthDateForm = this.fb.group({
    dataNascimento: ['', Validators.required],
    currentPassword: ['', Validators.required]
  });

  readonly passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatch }
  );

  usernameLoading = false;
  usernameSuccess = '';
  usernameError = '';

  emailLoading = false;
  emailSuccess = '';
  emailError = '';

  birthDateLoading = false;
  birthDateSuccess = '';
  birthDateError = '';

  passwordLoading = false;
  passwordSuccess = '';
  passwordError = '';

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  toggleEdit(): void {
    this.showEdit = !this.showEdit;
    if (this.showEdit) {
      this.state$.pipe(take(1)).subscribe((state) => {
        if (!state.profile) return;

        this.usernameForm.patchValue({ newUsername: state.profile.username, currentPassword: '' });
        this.emailForm.patchValue({
          email: state.profile.email,
          currentPassword: ''
        });
        this.birthDateForm.patchValue({
          dataNascimento: this.toInputDate(state.profile.dataNascimento),
          currentPassword: ''
        });
      });
      return;
    }

    this.usernameForm.reset();
    this.emailForm.reset();
    this.birthDateForm.reset();
    this.passwordForm.reset();
    this.usernameSuccess = '';
    this.usernameError = '';
    this.emailSuccess = '';
    this.emailError = '';
    this.birthDateSuccess = '';
    this.birthDateError = '';
    this.passwordSuccess = '';
    this.passwordError = '';
  }

  onUpdateUsername(): void {
    if (this.usernameForm.invalid || this.usernameLoading) return;

    this.usernameLoading = true;
    this.usernameSuccess = '';
    this.usernameError = '';

    const { newUsername, currentPassword } = this.usernameForm.value;

    this.userService.updateUsername(newUsername!, currentPassword!).subscribe({
      next: (response) => {
        this.usernameLoading = false;
        if (response.success) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('username', response.data.user.username);
          this.usernameSuccess = response.message || 'Username atualizado com sucesso.';
          this.usernameForm.reset();
          this.refresh$.next();
        } else {
          this.usernameError = response.message || 'Erro ao atualizar username.';
        }
      },
      error: (err) => {
        this.usernameLoading = false;
        this.usernameError = err?.error?.message || 'Erro ao atualizar username.';
      }
    });
  }

  onUpdateEmail(): void {
    if (this.emailForm.invalid || this.emailLoading) return;

    this.emailLoading = true;
    this.emailSuccess = '';
    this.emailError = '';

    const { email, currentPassword } = this.emailForm.value;

    this.userService.updateEmail(email!, currentPassword!).subscribe({
      next: (response) => {
        this.emailLoading = false;
        if (response.success) {
          this.emailSuccess = response.message || 'Email atualizado com sucesso.';
          this.emailForm.patchValue({ currentPassword: '' });
          this.refresh$.next();
        } else {
          this.emailError = response.message || 'Erro ao atualizar email.';
        }
      },
      error: (err) => {
        this.emailLoading = false;
        this.emailError = err?.error?.message || 'Erro ao atualizar email.';
      }
    });
  }

  onUpdateBirthDate(): void {
    if (this.birthDateForm.invalid || this.birthDateLoading) return;

    this.birthDateLoading = true;
    this.birthDateSuccess = '';
    this.birthDateError = '';

    const { dataNascimento, currentPassword } = this.birthDateForm.value;

    this.userService.updateBirthDate(dataNascimento!, currentPassword!).subscribe({
      next: (response) => {
        this.birthDateLoading = false;
        if (response.success) {
          this.birthDateSuccess = response.message || 'Data de nascimento atualizada com sucesso.';
          this.birthDateForm.patchValue({ currentPassword: '' });
          this.refresh$.next();
        } else {
          this.birthDateError = response.message || 'Erro ao atualizar data de nascimento.';
        }
      },
      error: (err) => {
        this.birthDateLoading = false;
        this.birthDateError = err?.error?.message || 'Erro ao atualizar data de nascimento.';
      }
    });
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid || this.passwordLoading) return;

    this.passwordLoading = true;
    this.passwordSuccess = '';
    this.passwordError = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.updatePassword(currentPassword!, newPassword!).subscribe({
      next: (response) => {
        this.passwordLoading = false;
        if (response.success) {
          this.passwordSuccess = response.message || 'Password atualizada com sucesso.';
          this.passwordForm.reset();
        } else {
          this.passwordError = response.message || 'Erro ao atualizar password.';
        }
      },
      error: (err) => {
        this.passwordLoading = false;
        this.passwordError = err?.error?.message || 'Erro ao atualizar password.';
      }
    });
  }

  private toInputDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }
}
