import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrderPopupComponent } from './live-order-popup.component';

describe('LiveOrderPopupComponent', () => {
  let component: LiveOrderPopupComponent;
  let fixture: ComponentFixture<LiveOrderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveOrderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
