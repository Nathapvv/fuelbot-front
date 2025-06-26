import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { environment } from '../../../environments/environment';
import { SweetAlertPosition } from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.css'],
  imports: [ReactiveFormsModule, CommonModule, BackButtonComponent],
})
export class UserSettingsPageComponent implements OnInit {
  settingsForm!: FormGroup;
  toastPositions = [
    'top',
    'top-start',
    'top-end',
    'center',
    'center-start',
    'center-end',
    'bottom',
    'bottom-start',
    'bottom-end',
  ];

  constructor(
    private fb: FormBuilder,
    private popupService: PopupService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(): void {
    const saved = JSON.parse(localStorage.getItem('userSettings') || '{}');

    this.settingsForm = this.fb.group({
      toastTimer: [saved.toastTimer ?? environment.toastTimer],
      toastPosition: [saved.toastPosition ?? environment.toastPosition],
      toastTimerProgressBar: [
        saved.toastTimerProgressBar ?? environment.toastTimerProgressBar,
      ],

      mapZoom: [saved.mapZoom ?? environment.mapZoom],
      mapMinZoom: [saved.mapMinZoom ?? environment.mapMinZoom],
      mapMaxZoom: [saved.mapMaxZoom ?? environment.mapMaxZoom],

      mapDarkThemeName: [
        saved.mapDarkThemeName ?? environment.mapDarkThemeName,
      ],
      mapLightThemeName: [
        saved.mapLightThemeName ?? environment.mapLightThemeName,
      ],
      mapTitleSize: [saved.mapTitleSize ?? environment.mapTitleSize],
      mapUserPinSize: [saved.mapUserPinSize ?? environment.mapUserPinSize],
      mapStationPinSize: [
        saved.mapStationPinSize ?? environment.mapStationPinSize,
      ],
      mapPinAnchorX: [saved.mapPinAnchorX ?? environment.mapPinAnchorX],
      mapPinAnchorY: [saved.mapPinAnchorY ?? environment.mapPinAnchorY],
      apiUrl: [saved.apiUrl ?? environment.apiUrl],
    });
  }

  saveSettings(): void {
    localStorage.setItem(
      'userSettings',
      JSON.stringify(this.settingsForm.value)
    );
    this.loadForm(); // recharge dans le formulaire

    this.popupService.fire({
      toast: true,
      icon: 'success',
      title: 'Paramètres enregistrés ✅',
      position: this.user.getUserSetting('toastPosition'),
      showConfirmButton: false,
      timer: this.user.getUserSetting('toastTimer'),
      timerProgressBar: this.user.getUserSetting('toastTimerProgressBar'),
    });
  }
}
