import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayHrsInExDialogComponent } from './holiday-hrs-in-ex-dialog.component';

describe('HolidayHrsInExDialogComponent', () => {
  let component: HolidayHrsInExDialogComponent;
  let fixture: ComponentFixture<HolidayHrsInExDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayHrsInExDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayHrsInExDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
