import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderDeliveryLogoutComponent } from './restaurant-order-delivery-logout.component';

describe('RestaurantOrderDeliveryLogoutComponent', () => {
  let component: RestaurantOrderDeliveryLogoutComponent;
  let fixture: ComponentFixture<RestaurantOrderDeliveryLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantOrderDeliveryLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderDeliveryLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
