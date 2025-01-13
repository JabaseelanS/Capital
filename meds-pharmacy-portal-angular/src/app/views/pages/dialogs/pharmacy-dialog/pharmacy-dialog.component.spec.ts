import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyDialogComponent } from './pharmacy-dialog.component';

describe('PharmacyDialogComponent', () => {
  let component: PharmacyDialogComponent;
  let fixture: ComponentFixture<PharmacyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
