import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcPriceComponent } from './otc-price.component';

describe('OtcPriceComponent', () => {
  let component: OtcPriceComponent;
  let fixture: ComponentFixture<OtcPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
