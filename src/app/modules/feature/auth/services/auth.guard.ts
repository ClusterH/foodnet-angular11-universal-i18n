import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private url: string;
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.url = state.url;
    if (this.auth.isAuthenticated()) {
      if (this.url.includes('/auth/login') || this.url.includes('/auth/register') || this.url.includes('/auth/lostpw') || this.url.includes('/auth/reset-password')) {
        this.router.navigate(['/profile/update']);
        return false;
      }
      return true;
    } else {
      if (this.url.includes('/auth/login') || this.url.includes('/auth/register') || this.url.includes('/auth/lostpw') || this.url.includes('/auth/reset-password')) {
        return true
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }
  }
}

