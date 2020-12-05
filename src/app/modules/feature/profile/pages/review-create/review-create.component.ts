import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewList } from '../../models';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { ReviewListService } from '../../services';

@Component({
  selector: 'app-review-create',
  templateUrl: './review-create.component.html',
  styleUrls: ['./review-create.component.scss']
})
export class ReviewCreateComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  description: string;
  message: any;
  evaluation: any;
  genLink: number;
  isAcceptGTC: boolean;
  isAcceptReview: boolean;
  isSpinner: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private reviewListService: ReviewListService
  ) {
    this._unsubscribeAll = new Subject();
    this.description = "Opinions require approval, which may take 3-5 business days. \n Thank you in advance for your patience!";
    this.message = "";
    this.evaluation = 1;
    this.isAcceptGTC = false;
    this.isAcceptReview = false;
  }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe(params => {
      if (params.genLink) {
        console.log(params); // { id: 2 }

        this.genLink = params.genLink;
        console.log(this.genLink); // popular
      }
      else {
      }
    });

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

  createNewReview(): void {
    this.isSpinner = true;
    const body = {
      message: this.message,
      rating: this.evaluation,
      genLink: this.genLink
    }

    console.log(body);

    this.reviewListService.createNewReview(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      this.isSpinner = false;
      this.router.navigate(['profile/review-list']);
    },
      (errorResponse) => {
        this.isSpinner = false;
      });;
  }
}
