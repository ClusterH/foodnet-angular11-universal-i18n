import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CookieService } from '@gorniv/ngx-universal';
import { RestaurantReviewService } from '../../services';
import { isEmpty } from 'lodash';


@Component({
  selector: 'app-restaurant-evaluation',
  templateUrl: './restaurant-evaluation.component.html',
  styleUrls: ['./restaurant-evaluation.component.scss']
})
export class RestaurantEvaluationComponent implements OnInit {
  evaluation: number = 4;
  reviewList: Array<any>;
  loadmore: boolean = false;
  isSpinner: boolean = false;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private restaurantReviewService: RestaurantReviewService
  ) {
    this._unsubscribeAll = new Subject();

    this.reviewList = [
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
      {
        title: "KissBela123",
        description: "I love this restaurant because the delivery is fast and the food is delicious too. I recommend",
        evaluation: 4
      },
    ]
  }

  ngOnInit(): void {
    // this.restaurantReviewService.getRestaurantReviews().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

    // })
  }

  points(i: number) {
    return new Array(i);
  }
  evaluationSelect(item): void {
    this.evaluation = item + 1;
  }

  loadMore(): void {
    this.loadmore = !this.loadmore;
  }
}
