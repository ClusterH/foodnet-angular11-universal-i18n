import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestaurantList } from '../models/restaurant.model'

@Injectable()
export class RestaurantFilterService {
  apiBase = 'http://api.foodnet.ro/api/location/';

  constructor(private _httpClient: HttpClient) { }

  getRestaurantsByLocation(lang: string, location: string): Observable<any> {
    return this._httpClient.get<RestaurantList>(`${this.apiBase}${lang}/${location}`);
  }
}
