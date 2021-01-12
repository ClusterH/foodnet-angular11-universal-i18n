import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class ReviewListService {
  apiBase = 'https://api.foodnet.ro/api/restaurant-reviews';

  constructor(
    private _httpClient: HttpClient,
    public cookieService: CookieService,
    private sessionService: SessionStorageService
  ) { }

  getAddableReviewList(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiBase}/addition-list`);
  }

  // deleteReview(id): Observable<any> {
  //   return this._httpClient.delete<any>(`${this.apiBase}${id}`);
  // }

  createNewReview(body: any): Observable<any> {
    return this._httpClient.post<any>(`${this.apiBase}`, body);
  }

  getReviewList(id?: number): Observable<any> {
    if (id) {
      return this._httpClient.get<any>(`${this.apiBase}/${id}`);
    } else {
      return this._httpClient.get<any>(`${this.apiBase}/added-list`);
    }
  }
}
