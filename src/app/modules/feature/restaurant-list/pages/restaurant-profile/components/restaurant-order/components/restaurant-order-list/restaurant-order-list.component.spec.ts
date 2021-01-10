import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderListComponent } from './restaurant-order-list.component';

describe('RestaurantOrderListComponent', () => {
  let component: RestaurantOrderListComponent;
  let fixture: ComponentFixture<RestaurantOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
