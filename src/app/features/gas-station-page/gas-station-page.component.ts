import { PopupService } from './../../services/popup.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gas-station-page',
  templateUrl: './gas-station-page.component.html',
  styleUrls: ['./gas-station-page.component.css'],
  imports: [CommonModule, BackButtonComponent, FormsModule],
})
export class GasStationPageComponent implements OnInit {
  public stationId!: string;
  public isLoading: boolean = true;
  public stationDetails: any;
  public selectedGaz: any = undefined;
  public price: number = 10;
  public liters: number = 0;
  private fuelPricePerLitre: number = 0;

  private isUpdating: boolean = false;

  updateSelectedGaz(item: any) {
    this.selectedGaz = item;
    this.fuelPricePerLitre = this.selectedGaz.Price.value;
    this.onPriceChange();
  }

  onPriceChange(): void {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.liters = parseFloat((this.price / this.fuelPricePerLitre).toFixed(2));
    this.isUpdating = false;
  }

  onLitersChange(): void {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.price = parseFloat((this.liters * this.fuelPricePerLitre).toFixed(2));
    this.isUpdating = false;
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.stationId = this.route.snapshot.paramMap.get('id')!;
    this.getStationDetails(this.stationId);
  }

  getStationDetails(stationId: string) {
    this.apiService.getStationDetails(stationId).subscribe({
      next: (station) => {
        this.stationDetails = station;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  validatePurchase() {
    this.popupService
      .fire({
        title: 'Confirmer votre achat',
        html: `
        <div class="text-left">
          <p><strong>Station :</strong> ${this.stationDetails.name}</p>
          <p><strong>Lieu :</strong> ${this.stationDetails.city}</p>
          <hr class="my-2">
          <p><strong>Montant :</strong> ${this.price.toFixed(2)} €</p>
          <p><strong>Quantité :</strong> ${this.liters.toFixed(2)} L</p>
        </div>
      `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Valider',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3b82f6', // bleu Tailwind
        cancelButtonColor: '#e5e7eb', // gris clair
      })
      .then((result) => {
        if (result.isConfirmed) {
          const fueltype = this.selectedGaz.short_name ?? this.selectedGaz.name;

          this.apiService
            .createOrder(Number(this.stationId), fueltype, this.liters)
            .subscribe({
              next: (value) => {
                this.popupService
                  .fire({
                    icon: 'success',
                    title: 'Paiement confirmé !',
                    html: `
                <p><strong>${this.stationDetails.name}</strong></p>
                <p class="mt-2">Votre code de réservation sera disponible dans votre <strong>historique de commandes</strong>.</p>
              `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b82f6',
                  })
                  .then(() => {
                    this.router.navigate(['/home']);
                  });
              },
              error: (err) => {
                console.log(err);
                this.popupService.fire({
                  icon: 'error',
                  title: 'Erreur lors du paiement',
                  html: `
                    <p>Une erreur s'est produite lors de la création de votre commande.</p>
                    <p class="mt-2 text-sm text-gray-500">${err?.error?.message}</p>
                  `,
                  confirmButtonText: 'Fermer',
                  confirmButtonColor: '#ef4444', // rouge
                });
              },
            });
        }
      });
  }
}
