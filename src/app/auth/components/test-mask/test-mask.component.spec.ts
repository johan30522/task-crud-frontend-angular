import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMaskComponent } from './test-mask.component';

describe('TestMaskComponent', () => {
  let component: TestMaskComponent;
  let fixture: ComponentFixture<TestMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestMaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
