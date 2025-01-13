import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrder2Component } from './live-order2.component';

describe('LiveOrder2Component', () => {
  let component: LiveOrder2Component;
  let fixture: ComponentFixture<LiveOrder2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveOrder2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOrder2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
