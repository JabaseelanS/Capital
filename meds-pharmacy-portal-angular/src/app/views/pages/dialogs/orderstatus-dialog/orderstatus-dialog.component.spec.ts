import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusDialogComponent } from './orderstatus-dialog.component';

describe('OrderStatusDialogComponent', () => {
  let component: OrderStatusDialogComponent;
  let fixture: ComponentFixture<OrderStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderStatusDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
