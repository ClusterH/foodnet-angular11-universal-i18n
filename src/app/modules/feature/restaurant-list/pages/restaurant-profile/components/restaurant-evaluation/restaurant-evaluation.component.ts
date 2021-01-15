import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';
import { RestaurantReviewService } from '../../services';
import { RestaurantReviewList } from '../../models';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-restaurant-evaluation',
  templateUrl: './restaurant-evaluation.component.html',
  styleUrls: ['./restaurant-evaluation.component.scss']
})
export class RestaurantEvaluationComponent implements OnInit {
  evaluation: number = 0;
  reviewList: RestaurantReviewList[];
  reviewList$: Observable<RestaurantReviewList[]>;
  reviewListLength = 0;
  reviewListLength$: Observable<number> = of(0);
  avgRating: number;
  totalReview: number;
  defaultShowReview: number = 12;
  restaurantId: number;
  loadmore: boolean = false;
  isSpinner: boolean = false;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private restaurantReviewService: RestaurantReviewService,
    private cookieService: CookieService
  ) {
    this._unsubscribeAll = new Subject();
    this.restaurantId = Number(JSON.parse(this.cookieService.get('restaurant')).restaurant_id);
  }

  ngOnInit(): void {
    this.getReviewList(0);
  }

  getReviewList(rating: number): void {
    this.isSpinner = true;
    this.restaurantReviewService.getRestaurantReviews(this.restaurantId, rating).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

      if (res.status == 200) {
        this.reviewList = res.result[0].ratings;
        if (this.reviewList.length < 12) {
          this.defaultShowReview = this.reviewList.length;
          this.loadmore = true;
        } else {
          this.defaultShowReview = 12;
        }

        this.reviewList$ = of(this.reviewList.slice(0, this.defaultShowReview));
        this.reviewListLength = this.reviewList.length;
        this.reviewListLength$ = of(this.reviewList.length);
        this.avgRating = res.result[0].AVGrating;
        this.totalReview = this.reviewList.length;
      }
      this.isSpinner = false;
    })
  }

  points(i: number) {
    return new Array(i);
  }
  evaluationSelect(item): void {
    this.evaluation = item;
    this.getReviewList(this.evaluation);
  }

  loadMore(): void {
    this.defaultShowReview = 2 * this.defaultShowReview;
    if (this.defaultShowReview > this.totalReview) {
      this.defaultShowReview = this.totalReview;
      this.loadmore = true;
    }

    this.reviewList$ = of(this.reviewList.slice(0, this.defaultShowReview));
  }
}
