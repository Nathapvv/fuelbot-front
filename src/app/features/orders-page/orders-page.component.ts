import { PopupService } from './../../services/popup.service';
import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-oders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
  imports: [BackButtonComponent, CommonModule],
})
export class OrdersPageComponent implements OnInit {
  public commandes: any[] = [];
  public commandesPending: number = 0;
  public isLoading = true;

  constructor(
    private popupService: PopupService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getOrders().subscribe({
      next: (value: any) => {
        this.commandes = value;
        this.commandesPending = this.commandes.filter((order) => {
          return order.orderStatus == 'EN_ATTENTE';
        }).length;
      },
      complete: () => {
        this.isLoading = false;
      },
      error(err) {},
    });
  }

  showQRCode(orderId: any): void {
    // Tu peux remplacer cette valeur par une vraie URL de commande, ID, etc.
    const qrData = `https://tonapp.com/commande/${orderId}`;

    // Utilisation d'une API de QR code temporaire (ou remplace par ta propre lib QR si offline)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrData
    )}&size=150x150`;

    this.popupService.fire({
      title: 'QR Code de la commande',
      html: `<img src="${qrUrl}" alt="QR Code" class="mx-auto mt-2">`,
      confirmButtonText: 'Fermer',
    });
  }
}
