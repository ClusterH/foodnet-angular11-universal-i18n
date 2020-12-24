import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestaurantList } from '../models'

@Injectable()
export class RestaurantFilterService {
  apiBase = 'https://api.foodnet.ro/api/location/';

  constructor(private _httpClient: HttpClient) { }

  getRestaurantsByLocation(lang: string, locationId: number): Observable<any> {
    return this._httpClient.get<RestaurantList>(`${this.apiBase}${lang}/${locationId}`);
  }

  getFilteredRestaurants(body: any): Observable<any> {
    return this._httpClient.post<RestaurantList>(`${this.apiBase}home/search`, body);
  }
}
