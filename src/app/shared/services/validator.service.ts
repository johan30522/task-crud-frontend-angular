import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";


  public cantContainString = (control: FormControl): ValidationErrors | null => {

    const value = control.value;
    if (value?.includes('abc')) {
      return { cantContainString: true };
    }
    return null;
  }

  public isValidField(form: FormGroup,field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getErrorMessage(form: FormGroup, field: string): string | null {
    if (!this.isValidField(form, field)) return null;

    const errors = form.controls[field].errors;
    if (errors?.['required']) {
      return 'Este campo es requerido';
    } else if (errors?.['email']) {
      return 'El formato del email es incorrecto';
    } else if (errors?.['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `El mínimo de caracteres es ${minLength}`;
    } else if (errors?.['cantContainString']) {
      return 'No se permite la cadena "abc"';
    }

    return 'Campo no válido';
  }


  public isFieldOneEqualFieldTwo( field1: string, field2: string ) {

    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if ( fieldValue1 !== fieldValue2 ) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    }

  }
}
