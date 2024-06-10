import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskWizardComponent } from './user-task-wizard.component';

describe('UserTaskWizardComponent', () => {
  let component: UserTaskWizardComponent;
  let fixture: ComponentFixture<UserTaskWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTaskWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTaskWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
