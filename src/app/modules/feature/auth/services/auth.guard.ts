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

  // private authState(): boolean {
  //   if (this.isLoginOrRegister()) {
  //     this.router.navigate(['/']);
  //     return false;
  //   }
  //   return true;
  // }
  // private notAuthState(): boolean {
  //   if (this.isLoginOrRegister()) {
  //     return true;
  //   }
  //   this.router.navigate(['/auth/login']);
  //   return false;
  // }
  // private isLoginOrRegister(): boolean {
  //   if (this.url.includes('/auth/login') || this.url.includes('/auth/register')) {
  //     return true;
  //   }
  //   return false;
  // }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log(next, '===>>>', this.auth.isLoggedIn, state);
    if (this.auth.isAuthenticated()) {
      console.log('=====>>>Authenticated');
      return true;
    } else {
      console.log('=====>>>UN Authenticated');
      this.router.navigate(['/']);
      return false;
    }
  }
}

