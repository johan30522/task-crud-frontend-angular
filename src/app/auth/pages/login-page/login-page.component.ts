import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorResponse } from '../../../shared/interfaces/interfaces';
import { parseValidationErrors } from '../../../utils/parseValidationErrors'; // Ajusta la ruta según corresponda
import { ValidatorService } from '../../../shared/services/validator.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public loginForm = new FormGroup({
    username: new FormControl<string>('string9@123.com', [Validators.required, Validators.email]),
    password: new FormControl<string>('12345678', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private validatorService: ValidatorService
  ) { }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.loginForm, field);
  }

  getErrorMessage(field: string): string | null {
    return this.validatorService.getErrorMessage(this.loginForm, field);
  }

  public errorMessages: { [key: string]: string } = {};

  onSubmit() {
    console.log('onSubmit', this.loginForm.value)
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('pasa validaciones');
    console.log(this.loginForm.value);

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: response => {
        if ('user' in response) {
          this.router.navigate(['/main']);
        }
      },
      error: (error: ErrorResponse) => {
        this.errorMessages = parseValidationErrors(error);
      }
    });
  }

}
