import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySpecialHoursComponent } from './pharmacy-special-hours.component';

describe('PharmacySpecialHoursComponent', () => {
  let component: PharmacySpecialHoursComponent;
  let fixture: ComponentFixture<PharmacySpecialHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacySpecialHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacySpecialHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
