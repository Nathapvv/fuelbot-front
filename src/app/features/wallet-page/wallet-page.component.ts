import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { CommonService } from '../../services/common.service';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.css'],
  imports: [BackButtonComponent, RouterModule, CommonModule],
})
export class WalletPageComponent implements OnInit {
  public wallet: number = 0;
  public isLoading = true;
  constructor(
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getSolde();
  }

  private getSolde() {
    this.apiService.getSolde().subscribe({
      next: (value: any) => {
        this.wallet = value?.solde;
      },
      complete: () => {
        this.isLoading = false;
      },
      error(err) {},
    });
  }

  addWallet() {
    this.commonService.addWallet().finally(() => {
      this.getSolde();
    });
  }
}
