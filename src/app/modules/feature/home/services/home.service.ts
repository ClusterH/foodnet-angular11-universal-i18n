import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Restaurants } from '../models/home.model'

@Injectable()
export class HomeService {
  apiBase = 'https://shielded-anchorage-51692.herokuapp.com/api/location/home/';

  constructor(private _httpClient: HttpClient) { }

  getBiggerCityRestaurants(city: string, langPath: string): Observable<any> {
    return this._httpClient.get<Restaurants>(`${this.apiBase}${langPath}${city}`);
  }
}
