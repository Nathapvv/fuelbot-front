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
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    title: getTitlePage('Accueil'),
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    component: SearchPageComponent,
    title: getTitlePage('Recherche de station'),
    canActivate: [AuthGuard],
  },
  // USER
  {
    path: 'user',
    component: MenuPageComponent,
    title: getTitlePage('Menu'),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/modify',
    component: UserModificationComponent,
    title: getTitlePage('Modifier mon compte'),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/settings',
    component: UserSettingsPageComponent,
    title: getTitlePage('Modifier paramètres'),
    canActivate: [AuthGuard],
  },
  // WALLETS
  {
    path: 'user/wallet',
    component: WalletPageComponent,
    title: getTitlePage('Gérer mon portefeuille'),
    canActivate: [AuthGuard],
  },
  // ORDERS
  {
    path: 'user/orders',
    component: OrdersPageComponent,
    title: getTitlePage('Gérer mon portefeuille'),
    canActivate: [AuthGuard],
  },
  // GAS STATION
  {
    path: 'gas-station/:id',
    component: GasStationPageComponent,
    title: getTitlePage('Informations sur la station'),
    canActivate: [AuthGuard],
  },
  // AUTH
  {
    path: 'login',
    component: LoginPageComponent,
    title: getTitlePage('Connexion'),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: getTitlePage('Créer un compte'),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

function getTitlePage(titlePage: string) {
  return environment.appName + ' - ' + titlePage;
}
