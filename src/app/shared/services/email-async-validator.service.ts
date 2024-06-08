import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, debounceTime, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailAsyncValidatorService implements AsyncValidator {

  constructor(
    private authService: AuthService
  ) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    console.log('dispara el validadaor para', control.value);

    return this.authService.validateEmail(control.value).pipe(
      tap(isValid => console.log('isValid EmailAsync', isValid)),
      map(isValid => isValid ? null : { emailExists: true }),
      catchError(() => of(null))
    );
    

  }
}
