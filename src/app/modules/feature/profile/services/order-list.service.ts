import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';
import { OrderList } from '../models';

@Injectable({
  providedIn: 'root'
})

export class OrderListService {
  apiBase = 'https://api.foodnet.ro/api/order/';

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
  ) { }

  getOrderList(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}`);
  }

  getOrderDetail(lang: string, orderId: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}${lang}/${orderId}`);
  }
}

