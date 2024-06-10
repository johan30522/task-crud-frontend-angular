import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../task/interfaces/Task.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorService } from '../../../shared/services/validator.service';
import { EmailAsyncValidatorService } from '../../../shared/services/email-async-validator.service';
import { Options } from '@angular-slider/ngx-slider';
import { UserRegisterWithTasks } from '../../interfaces/user.interface';

@Component({
  selector: 'user-task-wizard',
  templateUrl: './user-task-wizard.component.html',
  styleUrl: './user-task-wizard.component.css'
})
export class UserTaskWizardComponent {

  currentStep = 1;
  // userForm: FormGroup;
  // taskForm: FormGroup;
  taskStatusValues = [TaskStatus.Pendiente];
  validationError: string = '';
  public showToast = false;
  public msgToast = 'Tarea actualizada correctamente';

  ageRangeOptions: Options = {
    floor: 18,
    ceil: 100,
    step: 1,
    translate: (value: number): string => {
      return value + ' años';
    }
  };
  minAge: number = 25;
  maxAge: number = 30;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validatorService: ValidatorService,
    private emailAsyncValidator: EmailAsyncValidatorService
  ) {
  }

  public userForm: FormGroup = this.fb.group({
    userName: new FormControl<string>('pedro', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>('pedro@123.com', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailAsyncValidator.validate.bind(this.emailAsyncValidator)],
      updateOn: 'blur'
    }),
    phone: new FormControl<string>('4234-2332', [Validators.required, Validators.pattern(this.validatorService.phonePattern)]),
    ageRange: new FormControl<string>('25-30', [Validators.required]),
    password: new FormControl<string>('Aa12345678', [Validators.required, Validators.minLength(8), Validators.pattern(this.validatorService.passwordPattern)]),
    confirmPassword: new FormControl<string>('Aa12345678', [Validators.required]),
  }, {
    validators: [this.validatorService.isFieldOneEqualFieldTwo('password', 'confirmPassword')]
  });

  public taskForm: FormGroup = this.fb.group({
    tasks: this.fb.array(this.initializeTasks())
  });

  isValidField(field: string) {
    return this.validatorService.isValidField(this.userForm, field);
  }
  isValidFieldTask(form: AbstractControl<any, any>, field: string) {
    let formEval: FormGroup = form as FormGroup;
    return this.validatorService.isValidField(formEval, field);
  }
  getErrorMessageTask(form: AbstractControl<any, any>, field: string): string | null {
    let formEval: FormGroup = form as FormGroup;
    return this.validatorService.getErrorMessage(formEval, field);
  }
  getErrorMessage(field: string): string | null {
    return this.validatorService.getErrorMessage(this.userForm, field);
  }

  get tasks(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  initializeTasks(): FormGroup[] {
    const taskArray = [];
    for (let i = 0; i < 5; i++) {
      taskArray.push(this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        status: [TaskStatus.Pendiente, Validators.required]
      }));
    }
    return taskArray;
  }

  addTask(): void {
    this.tasks.push(this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: [TaskStatus.Pendiente, Validators.required]
    }));
  }

  removeTask(index: number): void {
    this.tasks.removeAt(index);
  }

  onAgeRangeChange(): void {
    this.userForm.patchValue({
      ageRange: `${this.minAge}-${this.maxAge}`
    });
  }

  isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.get(field1);
      const control2 = formGroup.get(field2);
      if (control1?.value !== control2?.value) {
        control2?.setErrors({ notEqual: true });
      } else {
        control2?.setErrors(null);
      }
    };
  }

  nextStep() {
    if (this.currentStep === 1 && this.userForm.valid) {
      this.currentStep++;
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  saveUserAndTasks() {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.tasks.length < 5) {
      this.validationError = 'Debe agregar al menos 5 tareas.';
      this.taskForm.markAllAsTouched();
      return;
    }
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    let userRegister: UserRegisterWithTasks = this.userForm.value as UserRegisterWithTasks;
    let tasks = this.taskForm.value.tasks as Task[];

    userRegister.tasks = tasks;

    this.authService.registerWithTasks(userRegister).subscribe({
      next: () => {

        this.msgToast = 'Usuario registrado correctamente';
        this.showSuccessToast();

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000); 
      },
      error: (error: any) => {
        this.validationError = error;
      }
    });

  }
  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // El toast se oculta después de 3 segundos
  }
  hideToast() {
    this.showToast = false;
  }
}