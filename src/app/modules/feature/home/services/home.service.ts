import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Restaurants } from '../models/home.model'

@Injectable()
export class HomeService {
  apiBase = 'https://api.foodnet.ro/api/location/';

  constructor(private _httpClient: HttpClient) { }
  getLocations(lang: string): Observable<any> {
    return this._httpClient.get<Restaurants>(`${this.apiBase}${lang}`);
  }

  getBiggerCityRestaurants(cityId: number, langPath: string): Observable<any> {
    return this._httpClient.get<Restaurants>(`${this.apiBase}home/${langPath}${cityId}`);
  }
}
