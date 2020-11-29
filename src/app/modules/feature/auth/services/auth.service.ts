import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';

import * as moment from 'moment';

import { User } from '../models/signin-user.model'

const jwt = new JwtHelperService();

class DecodedToken {
  exp: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  onLogInState: boolean;
  // public loading$ = false;

  apiBase = 'http://api.foodnet.ro/api/auth';
  private decodedToken;

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
    private sessionService: SessionStorageService
  ) {
    this.decodedToken = this.cookieService.get('auth_meta') || new DecodedToken();
  }

  public register(userData: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/register`, userData).pipe(map(res => {
      return this.saveToken(res.result[0].token);
    }))
  }

  logIn(userData: any, isStay: boolean): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/login`, userData).pipe(map(res => {
      return this.saveToken(res.result[0].token, isStay);
    }))
  }

  reset(userData: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/reset`, userData).pipe(map(res => {
      return res;
    }))
  }

  resetPWD(userData: any, token: string): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}/reset-password/${token}`, userData).pipe(map(res => {
      return this.saveToken(res.result[0].token);
    }))
  }

  public logout(): void {
    this.cookieService.removeAll();
    this.sessionService.clear();

    this.decodedToken = new DecodedToken();
  }

  private saveToken(token: any, isStay?: boolean): any {
    this.decodedToken = jwt.decodeToken(token);
    this.cookieService.put('auth_meta', JSON.stringify(this.decodedToken));
    this.sessionService.setItem('auth_tkn', token);
    if (isStay) {
      this.cookieService.put('stay_login', 'stayed');
      this.cookieService.put('auth_tkn', token);
    }
    return token;
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }
}

