import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDrugImagesComponent } from './upload-drug-images.component';

describe('UploadDrugImagesComponent', () => {
  let component: UploadDrugImagesComponent;
  let fixture: ComponentFixture<UploadDrugImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDrugImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDrugImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
