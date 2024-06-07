import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserRegister } from '../../interfaces/user.interface';
import { ErrorResponse } from '../../../shared/interfaces/interfaces';
import { parseValidationErrors } from '../../../utils/parseValidationErrors';
import { ValidatorService } from '../../../shared/services/validator.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validatorService: ValidatorService
  ) { }


  public registerForm: FormGroup = this.fb.group({
    userName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [Validators.required, Validators.pattern(this.validatorService.phonePattern)]),
    ageRange: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.pattern(this.validatorService.passworPattern)]),
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


  public errorMessages: { [key: string]: string } = {};

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log(this.registerForm.value);
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
