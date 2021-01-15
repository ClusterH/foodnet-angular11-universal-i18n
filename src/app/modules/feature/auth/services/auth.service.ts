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

  apiBase = 'https://api.foodnet.ro/api/auth';

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

  logIn(userData: any, isStay: boolean, lang: string): Observable<any> {
    const UserData = { ...userData, ...{ lang: lang } };
    return this._httpClient.post<any>(`${this.apiBase}/login`, UserData).pipe(map(res => {
      return this.saveToken(res, isStay, userData);
    }))
  }

  reset(userData: any, lang: string): Observable<any> {
    const UserData = { ...userData, ...{ lang: lang } };
    return this._httpClient.post<any>(`${this.apiBase}/reset`, UserData).pipe(map(res => {
      return res;
    }))
  }

  resetPWD(userData: any, token: string): Observable<any> {
    let UserDate = userData;
    return this._httpClient.post<any>(`${this.apiBase}/reset-password/${token}`, userData).pipe(map(res => {
      UserDate.email = res.result[0].email;
      return this.saveToken(res, true, UserDate);
    }))
  }

  public logout(): void {
    const cookie_token = this.cookieService.get('authInfo');
    const lang = this.cookieService.get('change_lang');
    this.cookieService.removeAll();
    this.sessionService.clear();
    this.cookieService.put('authInfo', cookie_token);
    this.cookieService.put('change_lang', lang);
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
        return true;
      } else {
        return false;
      }
    } else {
      if (this.sessionService.getItem('auth_tkn')) {
        return true;
      } else {
        return false;
      }
    }
  }
}
