import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  templateUrl: './search-page.component.html',
  imports: [CommonModule, FormsModule, BackButtonComponent],
})
export class SearchPageComponent implements OnInit {
  query: string = '';
  results: any[] = [];
  selectedFuel: string = '';
  objectKeys = Object.keys;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
      if (this.query) {
        this.search();
      }
    });
  }
  goToStation(id: number): void {
    this.router.navigate(['/gas-station', id]);
  }

  search(): void {
    const url = `http://localhost:8080/api/stations/search?query=${encodeURIComponent(
      this.query
    )}${this.selectedFuel ? `&fuelType=${this.selectedFuel}` : ''}`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.results = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  selectFuel(type: string) {
    this.selectedFuel = this.selectedFuel === type ? '' : type;
    this.search();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }
}
