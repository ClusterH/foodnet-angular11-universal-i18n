import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CitySearchService {
  // apiBase_temp = 'https://shielded-anchorage-51692.herokuapp.com/api/location/';
  apiBase = 'https://api.foodnet.ro/api/location/';

  constructor(private _httpClient: HttpClient) { }
  getLocations(lang: string): Observable<any> {
    return this._httpClient.get<any[]>(`${this.apiBase}${lang}`);
  }
}
