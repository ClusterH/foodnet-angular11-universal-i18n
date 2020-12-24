import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class ChangePasswordService {
  apiBase = 'https://api.foodnet.ro/api/profile/';

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
    private sessionService: SessionStorageService
  ) { }

  changePwd(userData: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}reset-password`, userData)
  }
}

