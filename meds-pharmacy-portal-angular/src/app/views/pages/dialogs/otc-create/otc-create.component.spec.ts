import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcCreateComponent } from './otc-create.component';

describe('TestcreateComponent', () => {
  let component: OtcCreateComponent;
  let fixture: ComponentFixture<OtcCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtcCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
