import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-evaluation',
  templateUrl: './restaurant-evaluation.component.html',
  styleUrls: ['./restaurant-evaluation.component.scss']
})
export class RestaurantEvaluationComponent implements OnInit {
  evaluation: number = 4;
  reviewList: Array<{}>;
  loadmore: boolean = false;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
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
