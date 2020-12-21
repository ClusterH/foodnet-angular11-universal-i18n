import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSectionComponent } from './filter-section.component';

describe('ProfileMenulistComponent', () => {
  let component: FilterSectionComponent;
  let fixture: ComponentFixture<FilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
