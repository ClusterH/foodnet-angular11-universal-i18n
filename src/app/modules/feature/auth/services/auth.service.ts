import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from '@gorniv/ngx-universal';

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
  apiBase = 'https://shielded-anchorage-51692.herokuapp.com/api/auth';
  private decodedToken;

  constructor(private _httpClient: HttpClient, public cookieService: CookieService,
  ) {
    this.decodedToken = this.cookieService.get('auth_meta') || new DecodedToken();
  }

  public register(userData: any): Observable<any> {
    return this._httpClient.post(`${this.apiBase}/register`, userData);
  }

  logIn(userData: any): Observable<any> {
    return this._httpClient.post<User>(`${this.apiBase}/login`, userData).pipe(map(token => {
      console.log(token);
      return this.saveToken(token);
    }))
  }

  public logout(): void {
    this.cookieService.remove('auth_tkn');
    this.cookieService.remove('auth_meta');

    this.decodedToken = new DecodedToken();
  }

  private saveToken(token: any): any {
    this.decodedToken = jwt.decodeToken(token);
    this.cookieService.put('auth_tkn', token);
    this.cookieService.put('auth_meta', JSON.stringify(this.decodedToken));
    return token;
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }
}

