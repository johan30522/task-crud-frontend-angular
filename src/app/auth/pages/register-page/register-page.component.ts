import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  public registerForm = new FormGroup({
    userName: new FormControl<string>('johan', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>('johan@gmail.com',[Validators.required, Validators.email]),
    phone: new FormControl<string>('9991888282', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    ageRange: new FormControl<string>('25-30', [Validators.required]),
    password: new FormControl<string>('12345678', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('12345678', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private validatorService: ValidatorService
  ) { }

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
