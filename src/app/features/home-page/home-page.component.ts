import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { MapComponent } from '../../components/map/map.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [MapComponent, FormsModule],
})
export class HomePageComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  searchQuery: string = '';
  constructor(private router: Router) {}

  ngOnInit() {
    // Code de navigation supprimé car il causait des rechargements de page
  }

  goToMenu(): void {
    this.router.navigate(['/user']);
  }
  
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { query: this.searchQuery },
      });
    }
  }
}
