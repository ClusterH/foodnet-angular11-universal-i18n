import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RestaurantReviewService {
  apiBase = 'https://api.foodnet.ro/api/restaurant/review-list';

  constructor(private _httpClient: HttpClient) { }

  getRestaurantReviews(restaurantId: number, rating: number): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}/${restaurantId}/${rating}`);
  }
}
