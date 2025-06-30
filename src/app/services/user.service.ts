import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {
    this.getUserSettings();
  }

  private getUserSettings() {
    return JSON.parse(localStorage.getItem('userSettings') || '{}');
  }

  getUser() {
    if (localStorage.getItem('user') != null) {
      try {
        return JSON.parse(localStorage.getItem('user')!);
      } catch (err) {
        this.logout();
      }
    } else {
      this.logout();
    }
    return null;
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  getUserSetting(key: keyof typeof environment): any {
    const userSettings = this.getUserSettings();
    // Si l'utilisateur a une valeur enregistrée, on la retourne, sinon celle de l'env
    return userSettings[key] !== undefined
      ? userSettings[key]
      : environment[key];
  }
}
