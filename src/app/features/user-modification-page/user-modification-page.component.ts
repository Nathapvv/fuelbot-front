import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-user-modification-page',
  templateUrl: './user-modification-page.component.html',
  styleUrls: ['./user-modification-page.component.css'],
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModificationComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private apiService: ApiService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    const userDate = user?.dateNaissance?.split('T')[0];
    this.profileForm = this.fb.group({
      nom: [user.nom, Validators.required],
      prenom: [user.prenom, Validators.required],
      numeroTelephone: [
        user.numeroTelephone,
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      dateNaissance: [userDate, Validators.required],
      email: [{ value: user.email, disabled: true }], // lecture seule
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const data = this.profileForm.getRawValue();
      this.apiService.updateUser(data).subscribe({
        next: (value) => {
          sessionStorage.setItem('user', JSON?.stringify(value));
          this.popupService.fire({
            icon: 'success',
            title: 'Succès de la mise à jour',
            text: 'Votre compte a été mis à jour.',
          });
        },
        error: (err: any) => {
          this.popupService.fire({
            icon: 'error',
            title: 'Erreur de mise à jour',
            text:
              'Une erreur est survenue lors de la mise à jour du compte. ' +
              err?.error?.message,
          });
        },
      });
    }
  }

  showResetPassword() {
    this.commonService.showResetPasswordPopup();
  }
}
