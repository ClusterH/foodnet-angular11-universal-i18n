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
  isShown: boolean;
  currentReviewListId: number;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private reviewListService: ReviewListService
  ) {
    this._unsubscribeAll = new Subject();
    this.isShown = false;
  }

  ngOnInit(): void {
    const createReviewList = this.reviewListService.getAddableReviewList();
    const editReviewList = this.reviewListService.getReviewList();

    forkJoin([createReviewList, editReviewList]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([createList, editList]) => {
      this.createList = createList.result;
      this.editList = editList.result;
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
    this.router.navigate(['/profile/review-edit'], { queryParams: { id: reviewId } });
  }

  // closeMsg(isDelete: boolean): void {
  //   if (isDelete) {
  //     this.isSpinner = true;
  //     this.reviewListService.deleteReview(this.currentReviewListId).pipe(takeUntil(this._unsubscribeAll))
  //       .subscribe(res => {
  //         if (res.status == 200) {
  //           this.editList = this.editList.filter(list => list.id !== this.currentReviewListId);
  //           this.isShown = false;
  //           this.isSpinner = false;
  //         } else {
  //           this.isShown = false;
  //           this.isSpinner = false;
  //         }
  //       });
  //   } else {
  //     this.isShown = false;
  //   }
  // }

  // deleteReviewList(id: number) {
  //   this.isShown = true;
  //   this.currentReviewListId = id;
  // }
}
