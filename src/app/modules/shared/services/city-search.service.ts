import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CitySearchService {
  apiBase = 'https://shielded-anchorage-51692.herokuapp.com/api/location/';

  constructor(private _httpClient: HttpClient) { }
  getLocations(lang: string): Observable<any> {
    return this._httpClient.get<any[]>(`${this.apiBase}${lang}`);
  }
}


