import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderPaymentComponent } from './restaurant-order-payment.component';

describe('RestaurantOrderPaymentComponent', () => {
  let component: RestaurantOrderPaymentComponent;
  let fixture: ComponentFixture<RestaurantOrderPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantOrderPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
