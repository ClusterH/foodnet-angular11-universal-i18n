import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderDeliveryLoginComponent } from './restaurant-order-delivery-login.component';

describe('RestaurantOrderDeliveryLoginComponent', () => {
  let component: RestaurantOrderDeliveryLoginComponent;
  let fixture: ComponentFixture<RestaurantOrderDeliveryLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantOrderDeliveryLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderDeliveryLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
