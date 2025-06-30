import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: any, state: any): boolean | UrlTree {
    const isLoggedIn = this.userService.isLoggedIn();
    const url: string = state.url;

    // Si l'utilisateur est connecté, il ne doit pas accéder à /login ou /register
    if (isLoggedIn && (url === '/login' || url === '/register')) {
      return this.router.parseUrl('/home');
    }
    // Si l'utilisateur n'est pas connecté, il ne peut accéder qu'à /login ou /register
    if (!isLoggedIn && url !== '/login' && url !== '/register') {
      return this.router.parseUrl('/login');
    }
    return true;
  }
} 