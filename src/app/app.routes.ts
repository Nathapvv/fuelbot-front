import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { NotFoundPageComponent } from './features/not-found-page/not-found-page.component';
import { UserModificationComponent } from './features/user-modification-page/user-modification-page.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { MenuPageComponent } from './features/menu-page/menu-page.component';
import { RegisterPageComponent } from './features/register-page/register-page.component';
import { environment } from '../environments/environment';
import { WalletPageComponent } from './features/wallet-page/wallet-page.component';
import { OrdersPageComponent } from './features/orders-page/orders-page.component';
import { UserSettingsPageComponent } from './features/user-settings-page/user-settings-page.component';
import { GasStationPageComponent } from './features/gas-station-page/gas-station-page.component';
import { SearchPageComponent } from './features/search-page/search-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    title: getTitlePage('Accueil'),
  },
  {
    path: 'search',
    component: SearchPageComponent,
    title: getTitlePage('Recherche de station'),
  },
  // USER
  {
    path: 'user',
    component: MenuPageComponent,
    title: getTitlePage('Menu'),
  },
  {
    path: 'user/modify',
    component: UserModificationComponent,
    title: getTitlePage('Modifier mon compte'),
  },
  {
    path: 'user/settings',
    component: UserSettingsPageComponent,
    title: getTitlePage('Modifier paramètres'),
  },
  // WALLETS
  {
    path: 'user/wallet',
    component: WalletPageComponent,
    title: getTitlePage('Gérer mon portefeuille'),
  },
  // ORDERS
  {
    path: 'user/orders',
    component: OrdersPageComponent,
    title: getTitlePage('Gérer mon portefeuille'),
  },
  // GAS STATION
  {
    path: 'gas-station/:id',
    component: GasStationPageComponent,
    title: getTitlePage('Informations sur la station'),
  },
  // AUTH
  {
    path: 'login',
    component: LoginPageComponent,
    title: getTitlePage('Connexion'),
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: getTitlePage('Créer un compte'),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

function getTitlePage(titlePage: string) {
  return environment.appName + ' - ' + titlePage;
}
