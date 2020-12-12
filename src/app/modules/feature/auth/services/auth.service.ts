import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  apiBase = 'http://api.foodnet.ro/api/auth';

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
    private sessionService: SessionStorageService
  ) {

  }

  register(userData: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/register`, userData).pipe(map(res => {
      return this.saveToken(res, true, userData);
    }))
  }

  logIn(userData: any, isStay: boolean): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/login`, userData).pipe(map(res => {
      return this.saveToken(res, isStay, userData);
    }))
  }

  reset(userData: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/reset`, userData).pipe(map(res => {
      return res;
    }))
  }

  resetPWD(userData: any, token: string): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/reset-password/${token}`, userData).pipe(map(res => {
      return this.saveToken(res, true);
    }))
  }

  public logout(): void {
    const cookie_token = this.cookieService.get('authInfo');
    this.cookieService.removeAll();
    this.sessionService.clear();
    this.cookieService.put('authInfo', cookie_token);
    this.isLoggedIn = false;
  }

  private saveToken(res: any, isStay?: boolean, userData?: any): any {
    if (res.result[0].token) {
      this.sessionService.setItem('auth_tkn', res.result[0].token);
      this.cookieService.put('auth_name', res.result[0].name);
      this.cookieService.put('auth_email', userData.email);
      if (!this.cookieService.get('change_lang')) {
        const currentLang = window.location.pathname.split('/')[1] || 'ro';
        this.cookieService.put('change_lang', currentLang);
      }
    }

    if (isStay) {
      this.cookieService.put('stay_login', 'stayed');
      this.cookieService.put('auth_tkn', res.result[0].token);
    }
    return res.result[0].token;
  }

  public isAuthenticated(): boolean {
    if (this.cookieService.get('stay_login') == 'stayed') {
      if (this.cookieService.get('auth_tkn')) {
        this.isLoggedIn = true;
      }
    } else {
      if (this.sessionService.getItem('auth_tkn')) {
        this.isLoggedIn = true;
      }
    }
    return this.isLoggedIn;
  }
}
