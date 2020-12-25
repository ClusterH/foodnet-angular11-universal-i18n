import { TestBed } from '@angular/core/testing';

import { RestaurantReviewService } from './restaurant-review.service';

describe('RestaurantReviewService', () => {
  let service: RestaurantReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
