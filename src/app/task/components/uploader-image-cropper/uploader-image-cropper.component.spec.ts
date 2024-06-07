import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderImageCropperComponent } from './uploader-image-cropper.component';

describe('UploaderImageCropperComponent', () => {
  let component: UploaderImageCropperComponent;
  let fixture: ComponentFixture<UploaderImageCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploaderImageCropperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploaderImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
