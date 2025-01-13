import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDeliveryDialogComponent } from './book-delivery-dialog.component';

describe('BookDeliveryDialogComponent', () => {
  let component: BookDeliveryDialogComponent;
  let fixture: ComponentFixture<BookDeliveryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookDeliveryDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDeliveryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
