import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class DeliveryAddressService {
  apiBase = 'https://api.foodnet.ro/api/delivery-address/';
  apiBase_location = 'http://api.foodnet.ro/api/location/';

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
    private sessionService: SessionStorageService
  ) { }

  getDeliveryAddress(lang: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}${lang}`);
  }

  deleteDeliveryAddress(id): Observable<any> {
    return this._httpClient.delete<any>(`${this.apiBase}${id}`);
  }

  createDeliveryAddress(body: any, id?: number): Observable<any> {
    if (id == -1) {
      return this._httpClient.post<any>(`${this.apiBase}`, body);
    } else {
      return this._httpClient.post<any>(`${this.apiBase}${id}`, body);
    }
  }

  getLocations(lang: string): Observable<any> {
    return this._httpClient.get<any[]>(`${this.apiBase_location}${lang}`);
  }

  getCurrentAddress(id: number, lang: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}${lang}/${id}`);
  }
}
