import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PopupService } from '../../services/popup.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  public nom: string = '';
  public prenom: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public appVersion = environment.appVersion;
  public isLoading = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private popupService: PopupService,
    public darkModeService: DarkModeService,
    private user: UserService
  ) {}

  register() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !this.nom ||
      !this.prenom ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.popupService.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.popupService.fire({
        icon: 'error',
        title: 'Email invalide',
        text: 'Veuillez entrer une adresse mail valide.',
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.popupService.fire({
        icon: 'error',
        title: 'Mots de passe différents',
        text: 'Veuillez saisir le même mot de passe dans les deux champs.',
      });
      return;
    }

    this.isLoading = true;

    this.apiService
      .createAccount(this.nom, this.prenom, this.email, this.password)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/home']);
          this.popupService.fire({
            toast: true,
            position: this.user.getUserSetting('toastPosition'),
            showConfirmButton: false,
            timer: this.user.getUserSetting('toastTimer'),
            timerProgressBar: this.user.getUserSetting('toastTimerProgressBar'),
            icon: 'success',
            title: 'Compte créé !',
            text: 'Votre compte a été créé avec succès.',
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.popupService.fire({
            icon: 'error',
            title: 'Erreur',
            text:
              error.error ||
              'Une erreur est survenue lors de la création du compte.',
          });
        },
      });
  }

  GoToLogin() {
    this.router.navigate(['/login']);
  }

  getPasswordStrength(password: string): { level: string; color: string } {
    if (!password) return { level: '', color: '' };
    if (password.length < 6)
      return { level: 'Trop court', color: 'text-red-500' };

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;

    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (score === 0) return { level: 'Faible', color: 'text-red-500' };
    if (score === 1) return { level: 'Moyen', color: 'text-orange-500' };
    if (score === 2) return { level: 'Bon', color: 'text-yellow-500' };
    if (score === 3 && isLongEnough)
      return { level: 'Fort', color: 'text-green-500' };

    return { level: 'Bon', color: 'text-yellow-500' };
  }
}
