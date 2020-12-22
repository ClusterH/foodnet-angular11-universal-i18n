import { TestBed } from '@angular/core/testing';

import { RestaurantInfoService } from './restaurant-info.service';

describe('RestaurantInfoService', () => {
  let service: RestaurantInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
