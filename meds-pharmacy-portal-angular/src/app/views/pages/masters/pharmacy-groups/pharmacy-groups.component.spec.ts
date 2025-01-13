import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacyUserComponent } from '../pharmacy-user/pharmacy-user.component';


describe('PharmacyUserComponent', () => {
  let component: PharmacyUserComponent;
  let fixture: ComponentFixture<PharmacyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PharmacyUserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
