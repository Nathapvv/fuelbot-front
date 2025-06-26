import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { DarkModeService } from './dark-mode.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private darkModeService: DarkModeService) {}

  fire(
    options: import('sweetalert2').SweetAlertOptions
  ): Promise<import('sweetalert2').SweetAlertResult<any>> {
    const themeOptions = this.darkModeService.isDarkMode()
      ? {
          background: '#1f2937', // dark:bg-gray-800
          color: '#ffffff',
        }
      : {
          background: '#ffffff',
          color: '#000000',
        };

    return Swal.fire({
      confirmButtonColor: '#3b82f6',
      ...themeOptions,
      ...options,
    });
  }

  showValidationMessage(message: string) {
    Swal.showValidationMessage(message);
  }
}
