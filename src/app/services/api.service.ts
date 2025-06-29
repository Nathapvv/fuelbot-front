import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root', // Permet d'utiliser le service partout dans l'application
})
export class ApiService {
  constructor(private http: HttpClient, private user: UserService) {}
  
  private baseUrlUser = 'utilisateur'; // URL du backend
  private baseUrlStation = 'stations'; // URL du backend
  private baseUrlOrder = 'orders';
  private baseUrlWallet = 'wallet';

  /**
   * Crée un nouvel utilisateur en envoyant une requête POST au backend
   * @param email L'email de l'utilisateur
   * @param motDePasse Le mot de passe de l'utilisateur
   * @returns Observable de la réponse du backend
   */
  createAccount(
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string
  ): Observable<any> {
    const url = `${
      environment.apiUrl + this.baseUrlUser
    }/create?nom=${nom}&prenom=${prenom}&email=${email}&motDePasse=${motDePasse}`;
    const body = { nom, prenom, email, motDePasse };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('API Request - URL:', url);
    console.log('API Request - Body:', body);

    return this.http.post(url, body, { headers });
  }

  login(email: string, motDePasse: string): Observable<any> {
    const url =
      `${environment.apiUrl + this.baseUrlUser}/login?email=` +
      email +
      '&motDePasse=' +
      motDePasse;
    const body = { email, motDePasse };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('API Request - URL:', url);
    console.log('API Request - Body:', body);

    return this.http.post(url, body, { headers });
  }

  getNearbyStations(lat: Number, lon: Number) {
    const url =
      `${
        environment.apiUrl + this.baseUrlStation
      }/nearbyStations?lat=` +
      lat +
      '&lon=' +
      lon;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  getStationDetails(id: string) {
    const url =
      `${
        environment.apiUrl + this.baseUrlStation
      }/stationDetails?id=` + id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  resetPassword(email: string) {
    const url = `${
      environment.apiUrl + this.baseUrlUser
    }/reset-password?email=${email}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, null, {
      headers,
      responseType: 'text',
    });
  }

  createOrder(stationId: Number, fuelType: string, fuelQuantity: number) {
    const utilisateurId = this.user.getUser().idUtilisateur;
    const url = `${
      environment.apiUrl + this.baseUrlOrder
    }/createOrder`;
    const body = { utilisateurId, stationId, fuelType, fuelQuantity };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, { headers });
  }

  getOrders() {
    const userId = this.user.getUser().idUtilisateur;
    const url =
      `${environment.apiUrl + this.baseUrlOrder}/user?userId=` +
      userId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  getSolde() {
    const userId = this.user.getUser().idUtilisateur;
    const url =
      `${
        environment.apiUrl + this.baseUrlWallet
      }/solde?userId=` + userId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  deposit(amount: number) {
    const userId = this.user.getUser().idUtilisateur;
    const url = `${
      environment.apiUrl + this.baseUrlWallet
    }/deposit`;
    const body = { userId, amount };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, { headers });
  }

  updateUser(update: any) {
    const userMail = this.user.getUser().email;
    const url = `${
      environment.apiUrl + this.baseUrlUser
    }/update/${userMail}`;
    const body = update;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put(url, body, { headers });
  }
}
