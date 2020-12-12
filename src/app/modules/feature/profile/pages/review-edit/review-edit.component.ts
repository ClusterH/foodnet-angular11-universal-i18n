import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewListService } from '../../services';
import { ReviewList } from '../../models';

import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['./review-edit.component.scss']
})
export class ReviewEditComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  restaurant_name: string = "";
  opinion: string = "";
  evaluation: number = 5;
  id: number;
  isSpinner: boolean = true;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private reviewListService: ReviewListService
  ) {
    this._unsubscribeAll = new Subject();
    // this.restaurant_name = "Restaurant name";
    // this.opinion = "";
    // this.evaluation = 4;
  }

  ngOnInit(): void {
    this.getReview();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  points(i: number) {
    return new Array(i);
  }

  evaluationSelect(point: number) {
    this.evaluation = point + 1;
  }

  getReview(): void {
    this.activatedroute.queryParams.subscribe(params => {
      if (params.id) {

        this.reviewListService.getReviewList(params.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

          this.restaurant_name = res.result[0].restaurant_name;
          this.evaluation = res.result[0].review_rating;
          this.opinion = res.result[0].review_message;
          this.isSpinner = false;
        }, (errorResponse) => {
          this.isSpinner = false;
        });
      }
    });
  }

  saveReview(): void {
    // this.isSpinner = true;
    // const body = {
    //   message: this.opinion,
    //   rating: this.evaluation,
    // }

    //

    // this.reviewListService.createNewReview(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
    //
    //   this.isSpinner = false;
    this.router.navigate(['profile/review-list']);
    // },
    //   (errorResponse) => {
    //     this.isSpinner = false;
    //   });;
  }
}
