import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantSuccessComponent } from './restaurant-success.component';

describe('RestaurantSuccessComponent', () => {
  let component: RestaurantSuccessComponent;
  let fixture: ComponentFixture<RestaurantSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
