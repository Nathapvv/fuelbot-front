import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDark = false;

  constructor() {
    // Initialisation du thème au démarrage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleDarkMode(): void {
    this.isDark ? this.disableDarkMode() : this.enableDarkMode();
  }

  enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDark = true;
  }

  disableDarkMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.isDark = false;
  }

  isDarkMode(): boolean {
    return this.isDark;
  }
}
