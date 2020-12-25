import { TestBed } from '@angular/core/testing';

import { RestaurantMenuService } from './restaurant-menu.service';

describe('RestaurantMenuService', () => {
  let service: RestaurantMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
