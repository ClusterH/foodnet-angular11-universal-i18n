import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewListService } from '../../services';
import { ReviewList } from '../../models';

import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  createList: ReviewList[];
  editList: any;
  isSpinner: boolean = true;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private reviewListService: ReviewListService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    const createReviewList = this.reviewListService.getAddableReviewList();
    const editReviewList = this.reviewListService.getReviewList();

    forkJoin([createReviewList, editReviewList]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([createList, editList]) => {
      this.createList = createList.result;
      this.editList = editList.result;
      console.log(createList, editList);


      this.isSpinner = false;
    }, (errorResponse) => {
      this.isSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadComponent(reviewId): void {
    console.log(reviewId);
    this.router.navigate(['/profile/review-edit'], { queryParams: { id: reviewId } });
  }

  deleteReviewList(id: number) {
    this.isSpinner = true;
    this.reviewListService.deleteReview(id).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        console.log(res);
        this.editList = this.editList.filter(list => list.id !== res.result.id);
        this.isSpinner = false;
      }, (errorResponse) => {
        console.log(errorResponse);
        this.isSpinner = false;
      });
  }
}
