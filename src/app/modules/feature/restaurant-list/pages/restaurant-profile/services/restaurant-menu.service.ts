import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models'

@Injectable()
export class RestaurantMenuService {
  apiBase = 'https://api.foodnet.ro/api/product/';

  constructor(private _httpClient: HttpClient) { }

  getRestaurantCategory(body: {}): Observable<any> {
    return this._httpClient.post<Category>(`${this.apiBase}category`, body);
  }

  getRestaurantSubCategory(body: {}): Observable<any> {
    return this._httpClient.post<Category>(`${this.apiBase}subcategories`, body);
  }

  getRestaurantProducts(body: {}): Observable<any> {
    return this._httpClient.post<Category>(`${this.apiBase}subcategories-products`, body);
  }

  getRestaurantRequiredExtra(body: {}): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}required-extra`, body);
  }

  getRestaurantOptionalExtra(body: {}): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}optional-extra`, body);
  }
}
