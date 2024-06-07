
import { inject, Injectable } from '@angular/core';

import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthGuard {

  constructor(

    private authService: AuthService,

    private router: Router
  ) {}

  private  checkAuthStatus = (): boolean | Observable<boolean> => {

  
    return this.authService.checkAuthenticationStatus().pipe(
      tap((isAuth) => {
        console.log('isAuth', isAuth);
        if (!isAuth) this.router.navigate(['./auth/login']);
      })
    );
  };
 
  public canMatch: CanMatchFn = (route, segments) => {


    return this.checkAuthStatus();



  };

  public canActivate: CanActivateFn = (route, state) => {

    return this.checkAuthStatus();

  };

}