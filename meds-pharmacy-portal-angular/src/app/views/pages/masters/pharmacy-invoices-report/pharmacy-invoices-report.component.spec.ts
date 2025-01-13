import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyInvoicesReportComponent } from './pharmacy-invoices-report.component';

describe('PharmacyInvoicesReportComponent', () => {
  let component: PharmacyInvoicesReportComponent;
  let fixture: ComponentFixture<PharmacyInvoicesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyInvoicesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyInvoicesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
