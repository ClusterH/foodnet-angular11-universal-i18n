import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMenulistComponent } from './profile-menulist.component';

describe('ProfileMenulistComponent', () => {
  let component: ProfileMenulistComponent;
  let fixture: ComponentFixture<ProfileMenulistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMenulistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMenulistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
