import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RestaurantOrderService {
  apiBase = 'https://api.foodnet.ro/api/order';

  constructor(private _httpClient: HttpClient) { }

  restaurantOrder(body: {}): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}`, body);
  }
}
