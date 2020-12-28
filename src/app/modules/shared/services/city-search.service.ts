import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class CitySearchService {
  currentCity = new BehaviorSubject<any>(null);
  currentCity$ = this.currentCity.asObservable();

  apiBase = 'https://api.foodnet.ro/api/location/';

  constructor(private _httpClient: HttpClient) { }
  getLocations(lang: string): Observable<any> {
    return this._httpClient.get<any[]>(`${this.apiBase}${lang}`);
  }
}
