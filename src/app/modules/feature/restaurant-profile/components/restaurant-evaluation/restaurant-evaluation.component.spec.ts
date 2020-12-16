import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantEvaluationComponent } from './restaurant-evaluation.component';

describe('RestaurantEvaluationComponent', () => {
  let component: RestaurantEvaluationComponent;
  let fixture: ComponentFixture<RestaurantEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
