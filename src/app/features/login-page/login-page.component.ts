import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms'; // ✅ Nécessaire pour ngModel
import { CommonModule } from '@angular/common'; // ✅ Optionnel mais recommandé
import { PopupService } from '../../services/popup.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { SweetAlertPosition } from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout de FormsModule ici
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  public appVersion = environment.appVersion;
  public email: string = '';
  public password: string = '';

  constructor(
    private router: Router,
    private popupService: PopupService,
    public darkModeService: DarkModeService,
    private apiService: ApiService,
    private commonService: CommonService,
    private user: UserService
  ) {}

  ngOnInit() {}

  login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !this.password) {
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
        text: 'Veuillez saisir une adresse email valide.',
      });
      return;
    }

    this.apiService.login(this.email, this.password).subscribe({
      next: (user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/home']);
        this.popupService.fire({
          toast: true,
          position: this.user.getUserSetting(
            'toastPosition'
          ) as SweetAlertPosition,
          showConfirmButton: false,
          timer: this.user.getUserSetting('toastTimer'),
          timerProgressBar: this.user.getUserSetting('toastTimerProgressBar'),
          icon: 'success',
          title: 'Connexion !',
          text: 'Vous avez bien été connecté avec succès.',
        });
      },
      error: (error) => {
        this.popupService.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error || 'Une erreur est survenue lors de la connexion.',
        });
      },
    });
  }

  showResetPasswordPopup() {
    this.commonService.showResetPasswordPopup();
  }

  GoToRegister() {
    this.router.navigate(['/register']);
  }

  private clickCount = 0;
  private clickTimeout: any;

  onClickMultiple() {
    this.clickCount++;

    // Remet le compteur à zéro après 2 secondes sans clic
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, 2000);

    if (this.clickCount === 5) {
      this.clickCount = 0;
      this.router.navigate(['/user/settings']);
    }
  }
}
