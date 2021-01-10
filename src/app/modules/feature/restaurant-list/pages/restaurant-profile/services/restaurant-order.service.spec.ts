import { TestBed } from '@angular/core/testing';

import { RestaurantOrderService } from './restaurant-order.service';

describe('RestaurantOrderService', () => {
  let service: RestaurantOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
