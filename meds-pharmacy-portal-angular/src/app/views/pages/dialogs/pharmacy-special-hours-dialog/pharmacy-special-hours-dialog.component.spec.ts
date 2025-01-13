import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySpecialHoursDialogComponent } from './pharmacy-special-hours-dialog.component';

describe('PharmacySpecialHoursDialogComponent', () => {
  let component: PharmacySpecialHoursDialogComponent;
  let fixture: ComponentFixture<PharmacySpecialHoursDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacySpecialHoursDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacySpecialHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
