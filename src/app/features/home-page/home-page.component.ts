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
    // 1. Retour arrière
    window.addEventListener('popstate', () => {
      console.log('🔁 Refresh via popstate');
      window.location.reload();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('➡️ NavigationStart vers :', event.url);
        window.location.reload();
      }

      if (event instanceof NavigationEnd) {
        console.log('✅ NavigationEnd vers :', event.urlAfterRedirects);
        window.location.reload();
      }

      if (event instanceof NavigationCancel) {
        console.warn('❌ Navigation annulée');
        window.location.reload();
      }
    });
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
