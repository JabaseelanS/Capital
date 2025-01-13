import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierstatusDialogComponent } from './courierstatus-dialog.component';

describe('CourierstatusDialogComponent', () => {
  let component: CourierstatusDialogComponent;
  let fixture: ComponentFixture<CourierstatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierstatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierstatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
