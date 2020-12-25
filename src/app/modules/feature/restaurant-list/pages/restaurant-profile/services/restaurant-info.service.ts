import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models'

@Injectable()
export class RestaurantInfoService {
  apiBase = 'https://api.foodnet.ro/api/restaurant/info/';

  constructor(private _httpClient: HttpClient) { }

  getRestaurantInfo(lang: string, restaurantId: number): Observable<any> {
    return this._httpClient.get<Category>(`${this.apiBase}${lang}/${restaurantId}`);
  }
}
