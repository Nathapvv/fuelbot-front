import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { SweetAlertPosition } from 'sweetalert2';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root', // Permet d'utiliser le service partout dans l'application
})
export class CommonService {
  constructor(
    private popupService: PopupService,
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
  ) {}

  async addWallet(): Promise<void> {
    try {
      // Étape 1 : Demande du montant
      const montantPrompt = await this.popupService.fire({
        title: 'Montant à ajouter',
        input: 'number',
        inputLabel: 'Entrez le montant à ajouter',
        inputPlaceholder: 'Ex: 50',
        showCancelButton: true,
        confirmButtonText: 'Suivant',
      });

      if (!montantPrompt.isConfirmed) return;

      const montant = montantPrompt.value;

      if (!montant || montant <= 0) {
        await this.popupService.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Montant invalide.',
        });
        return;
      }

      // Étape 2 : Infos CB
      const { value: cbInfo } = await this.popupService.fire({
        title: 'Informations de carte bancaire',
        html: `<input id="swal-card" class="swal2-input" placeholder="Numéro de carte (16 chiffres)" maxlength="16">
             <input id="swal-date" class="swal2-input" placeholder="MM/AA">
             <input id="swal-crypto" class="swal2-input" placeholder="Cryptogramme" maxlength="3">`,
        focusConfirm: false,
        preConfirm: () => {
          const card = (
            document.getElementById('swal-card') as HTMLInputElement
          ).value;
          const date = (
            document.getElementById('swal-date') as HTMLInputElement
          ).value;
          const crypto = (
            document.getElementById('swal-crypto') as HTMLInputElement
          ).value;

          if (
            !/^\d{16}$/.test(card) ||
            !/^\d{2}\/\d{2}$/.test(date) ||
            !/^\d{3}$/.test(crypto)
          ) {
            this.popupService.showValidationMessage(
              'Veuillez remplir correctement toutes les informations.'
            );
            return;
          }

          return { card, date, crypto };
        },
        showCancelButton: true,
        confirmButtonText: 'Suivant',
      });

      if (!cbInfo) return;

      // Étape 3 : Confirmation finale
      const confirm = await this.popupService.fire({
        title: 'Confirmation',
        text: `Êtes-vous sûr de vouloir ajouter ${montant} € à votre portefeuille ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, confirmer',
        cancelButtonText: 'Retour',
      });

      if (!confirm.isConfirmed) {
        return this.addWallet(); // retour à l'étape 1
      }

      try {
        await lastValueFrom(this.apiService.deposit(montant));
        await this.popupService.fire({
          icon: 'success',
          title: 'Argent ajouté avec succès !',
          text: `${montant} € ont été ajoutés à votre portefeuille.`,
        });
      } catch (err: any) {
        await this.popupService.fire({
          icon: 'error',
          title: 'Erreur du dépôt',
          text:
            "Une erreur est survenue. Impossible d'ajouter l'argent. " +
            err?.error?.message,
        });
      } finally {
        console.log('Opération terminée'); // ici ton bloc finally fonctionne
      }
    } catch (error) {
      await this.popupService.fire({
        icon: 'error',
        title: 'Erreur',
        text: (error as Error).message || 'Une erreur est survenue.',
      });
    }
  }

  showLogout() {
    this.popupService
      .fire({
        title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
        text: 'Vous devrez vous reconnecter pour accéder à votre compte.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, me déconnecter',
        cancelButtonText: 'Annuler',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.userService.logout();
        }
      });
  }

  showResetPasswordPopup() {
    this.popupService
      .fire({
        title: 'Réinitialiser le mot de passe',
        input: 'email',
        inputLabel: 'Adresse email',
        inputPlaceholder: 'Entrez votre adresse email',
        showCancelButton: true,
        confirmButtonText: 'Envoyer',
        preConfirm: (email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email) {
            this.popupService.showValidationMessage(
              'Veuillez saisir une adresse email'
            );
            return false;
          }
          if (!emailRegex.test(email)) {
            this.popupService.showValidationMessage('Adresse email invalide');
            return false;
          }
          return email;
        },
      })
      .then((result) => {
        if (result.isConfirmed && result.value) {
          const email = result.value;

          this.apiService.resetPassword(email).subscribe({
            next: (res: any) => {
              // On récupère juste le texte brut
              const rawText = typeof res === 'string' ? res : res?.toString();

              // Extraction du mot de passe depuis "Nouveau mot de passe : abc123"
              const match = rawText?.match(/:\s*(.+)$/);
              const generatedPassword = match ? match[1] : null;

              if (!generatedPassword) {
                this.popupService.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Impossible d’extraire le mot de passe depuis la réponse du serveur.',
                });
                return;
              }

              this.popupService.fire({
                icon: 'success',
                title: 'Mot de passe réinitialisé',
                html: `
                  <p>Voici votre nouveau mot de passe :</p>
                  <input type="text" id="generatedPasswordInput" value="${generatedPassword}" class="swal2-input" readonly onclick="this.select()">
                  <button id="copyBtn" class="swal2-confirm swal2-styled" style="margin-top:10px">
                    Copier le mot de passe
                  </button>
                `,
                showConfirmButton: false,
                didOpen: () => {
                  const copyBtn = document.getElementById('copyBtn');
                  const passwordInput = document.getElementById(
                    'generatedPasswordInput'
                  ) as HTMLInputElement;

                  copyBtn?.addEventListener('click', () => {
                    if (passwordInput) {
                      navigator.clipboard
                        .writeText(passwordInput.value)
                        .then(() => {
                          this.popupService.fire({
                            toast: true,
                            position: this.userService.getUserSetting(
                              'toastPosition'
                            ) as SweetAlertPosition,
                            icon: 'success',
                            title: 'Mot de passe copié !',
                            showConfirmButton: false,
                            timer:
                              this.userService.getUserSetting('toastTimer'),
                            timerProgressBar: this.userService.getUserSetting(
                              'toastTimerProgressBar'
                            ),
                          });
                        });
                    }
                  });
                },
              });
            },
            error: (error) => {
              this.popupService.fire({
                icon: 'error',
                title: 'Erreur',
                text:
                  error?.error ||
                  'Une erreur est survenue pendant la réinitialisation.',
              });
            },
          });
        }
      });
  }
}
