import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserRegister } from '../../interfaces/user.interface';
import { ErrorResponse } from '../../../shared/interfaces/interfaces';
import { parseValidationErrors } from '../../../utils/parseValidationErrors';
import { ValidatorService } from '../../../shared/services/validator.service';
import { Options } from '@angular-slider/ngx-slider';
import { EmailAsyncValidatorService } from '../../../shared/services/email-async-validator.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

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
  ) { }


  public registerForm: FormGroup = this.fb.group({
    userName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailAsyncValidator.validate.bind(this.emailAsyncValidator)],
      updateOn: 'blur'
    }),
    phone: new FormControl<string>('', [Validators.required, Validators.pattern(this.validatorService.phonePattern)]),
    ageRange: new FormControl<string>('25-30', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.pattern(this.validatorService.passwordPattern)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  }, {
    validators: [this.validatorService.isFieldOneEqualFieldTwo('password', 'confirmPassword')]
  });


  isValidField(field: string) {
    return this.validatorService.isValidField(this.registerForm, field);
  }
  getErrorMessage(field: string): string | null {
    return this.validatorService.getErrorMessage(this.registerForm, field);
  }

  onAgeRangeChange(): void {
    this.registerForm.patchValue({
      ageRange: `${this.minAge}-${this.maxAge}`
    });
  }


  public errorMessages: { [key: string]: string } = {};

  onRegister() {
    if (!this.registerForm.valid) {
      console.log('invalido');
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('pasa validaciones', this.registerForm.value);

    const userRegister = this.registerForm.value;
    this.authService.register(userRegister as any).subscribe({
      next: user => {
        this.router.navigate(['/main']);
      },
      error: (error: ErrorResponse) => {
        this.errorMessages = parseValidationErrors(error);
        console.log(this.errorMessages);
      }
    });
  }

}
