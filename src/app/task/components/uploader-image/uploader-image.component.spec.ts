import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderImageComponent } from './uploader-image.component';

describe('UploaderImageComponent', () => {
  let component: UploaderImageComponent;
  let fixture: ComponentFixture<UploaderImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploaderImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploaderImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
