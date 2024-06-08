import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorService } from '../../../shared/services/validator.service';
import { EmailAsyncValidatorService } from '../../../shared/services/email-async-validator.service';
import { Options } from '@angular-slider/ngx-slider';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit{

  public user:User | undefined;

  
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

    private router: Router,
    private validatorService: ValidatorService,
    private emailAsyncValidator: EmailAsyncValidatorService,
    private authService: AuthService,
    private userServices: ProfileService
  ) { 
  }
  
  
  public registerForm: FormGroup = this.fb.group({
    userName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl<string>('', [Validators.required, Validators.pattern(this.validatorService.phonePattern)]),
    ageRange: new FormControl<string>('25-30', [Validators.required]),
    password: new FormControl<string>(''),
    
  }, {
    
  });
  
  ngOnInit(): void {
    if ( this.authService.getUser() ) {
      const [min, max] = this.authService.getUser()!.ageRange.split('-').map(Number);

      this.minAge = min | 25;
      this.maxAge = max| 30;
      this.user = this.authService.getUser();
      console.log('user', this.user);
      this.registerForm.reset({
        userName: this.user!.userName,
        phone: this.user!.phone,
        ageRange: this.user!.ageRange
      });
    }
  }

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

  onSubmit() {
    if (!this.registerForm.valid) {
      console.log('invalido');
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('pasa validaciones', this.registerForm.value);

    const userRegister:User = this.registerForm.value;

    userRegister.id = this.user!.id;

    this.userServices.UpdateUserProfile(userRegister).subscribe({
      next: user => {

        console.log('user actualizado', user);
        this.authService.setUser(user as User);

      },
      error: (error: any) => {
        this.errorMessages = error;
        console.log(this.errorMessages);
      }
    });







   
  }

}
