import { DarkModeService } from './../../services/dark-mode.service';
import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: Map;
  private hasFollowed = false;
  private vectorSource = new VectorSource();
  private destroy$ = new Subject<void>();
  private watchId: number | null = null;
  public hoveredStation: any | null = null;
  public tooltipX = 0;
  public tooltipY = 0;

  private addStationMarkers(stations: any[]): void {
    console.log('🛢️ Ajout de', stations.length, 'stations');

    stations.forEach((station) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([station.longitude, station.latitude])),
        name: station.name,
        id: station.id,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: '/station-marker.png',
            anchor: [
              this.user.getUserSetting('mapPinAnchorX'),
              this.user.getUserSetting('mapPinAnchorY'),
            ],
            scale: this.user.getUserSetting('mapStationPinSize'),
          }),
        })
      );

      this.vectorSource.addFeature(feature);
    });
  }
  public refresh(): void {
    console.log('↻ Refresh carte manuellement');
    this.vectorSource.clear();
    this.followUser();
  }

  private followUser() {
    if (this.hasFollowed) return;
    this.hasFollowed = true;

    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = fromLonLat([
            pos.coords.longitude,
            pos.coords.latitude,
          ]);

          // Récentre la carte
          this.map.getView().setCenter(coords);

          // Déplace le marker
          const marker = new Feature({
            geometry: new Point(coords),
          });

          marker.setStyle(
            new Style({
              image: new Icon({
                src: '/arrow-marker.png',
                anchor: [
                  this.user.getUserSetting('mapPinAnchorX'),
                  this.user.getUserSetting('mapPinAnchorY'),
                ],
                scale: this.user.getUserSetting('mapUserPinSize'),
              }),
            })
          );

          this.vectorSource.clear();
          this.vectorSource.addFeature(marker);

          // Appel de l'API pour récupérer les stations avec gestion d'erreur
          this.apiService
            .getNearbyStations(pos.coords.latitude, pos.coords.longitude)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (stations: any) => {
                console.log('✅ Stations reçues:', stations.length);
                this.addStationMarkers(stations);
              },
              error: (error) => {
                console.warn('⚠️ Erreur lors de la récupération des stations:', error);
              }
            });
        },
        (err) => {
          console.warn('❌ Erreur géoloc (watch):', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );
    }
  }

  constructor(
    private darkModeService: DarkModeService,
    private apiService: ApiService,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.setupMapEvents();
    this.followUser();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.followUser();
      }
    });
  }

  private setupMapEvents(): void {
    this.map.on('pointermove', (event: any) => {
      const pixel = this.map.getEventPixel(event.originalEvent);
      const features = this.map.getFeaturesAtPixel(pixel);
      const stationFeature = features?.find((f) => f.get('name') !== undefined);

      if (stationFeature) {
        const coord = this.map.getEventCoordinate(event.originalEvent);
        const geometry = stationFeature.getGeometry() as Point;
        const [lon, lat] = geometry.getCoordinates();

        this.hoveredStation = {
          name: stationFeature.get('name'),
          id: 0,
          latitude: lat,
          longitude: lon,
        };

        this.tooltipX = event.originalEvent.offsetX + 10;
        this.tooltipY = event.originalEvent.offsetY + 10;
      } else {
        this.hoveredStation = null;
      }
    });

    this.map.on('singleclick', (event: any) => {
      const features = this.map.getFeaturesAtPixel(event.pixel);
      const clickedFeature = features?.find((f) => f.get('id') !== undefined);

      if (clickedFeature) {
        const stationId = clickedFeature.get('id');
        this.router.navigate(['/gas-station', stationId]);
      }
    });
  }

  goToMenu(): void {
    window.history.back(); // Ou utilise Router selon ton projet
  }

  private initMap(): void {
    const style = this.darkModeService.isDarkMode()
      ? this.user.getUserSetting('mapDarkThemeName') // sombre
      : this.user.getUserSetting('mapLightThemeName'); // clair

    const key = this.user.getUserSetting('mapKey');

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.maptiler.com/maps/${style}/256/{z}/{x}/{y}.png?key=${key}`,
            tileSize: this.user.getUserSetting('mapTitleSize'),
            crossOrigin: 'anonymous',
          }),
        }),
        new VectorLayer({
          source: this.vectorSource,
        }),
      ],
      view: new View({
        center: fromLonLat([2.3522, 48.8566]),
        zoom: this.user.getUserSetting('mapZoom'), // zoom initial
        minZoom: this.user.getUserSetting('mapMinZoom'), // 🔒 zoom minimum
        maxZoom: this.user.getUserSetting('mapMaxZoom'), // 🔒 zoom maximum
      }),
    });
  }

  ngOnDestroy(): void {
    console.log('🗺️ Destruction du composant Map');
    
    // Arrêter la géolocalisation
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    // Nettoyer les observables
    this.destroy$.next();
    this.destroy$.complete();
    
    // Détruire la carte si elle existe
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null as any;
    }
  }
}
