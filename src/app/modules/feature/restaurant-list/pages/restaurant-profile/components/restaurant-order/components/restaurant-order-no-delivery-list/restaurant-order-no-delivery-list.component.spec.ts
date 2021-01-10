import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderNoDeliveryListComponent } from './restaurant-order-no-delivery-list.component';

describe('RestaurantOrderNoDeliveryListComponent', () => {
  let component: RestaurantOrderNoDeliveryListComponent;
  let fixture: ComponentFixture<RestaurantOrderNoDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantOrderNoDeliveryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderNoDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
