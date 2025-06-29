import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { LoaderComponent } from './components/loader/loader.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private darkModeService: DarkModeService) {
    // Initialisation du dark mode
    this.darkModeService.isDarkMode();
    
    // Force la mise à jour de l'URL API dans le localStorage
    this.updateApiUrlInLocalStorage();
  }

  title = 'fuelbot-frontend';

  private updateApiUrlInLocalStorage(): void {
    try {
      const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      userSettings.apiUrl = environment.apiUrl;
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      console.log('API URL mise à jour dans localStorage:', environment.apiUrl);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'URL API:', error);
    }
  }
}
