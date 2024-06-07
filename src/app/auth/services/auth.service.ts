import { Injectable } from '@angular/core';
import { LoginResponse, User, UserRegister } from '../interfaces/user.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ErrorResponse } from '../../shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;

  private user?: User;
  private token?: string;
  private csrfToken?: string;

  constructor(
    private httpClient: HttpClient
  ) {

    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      this.csrfToken = csrfToken;
    }
  }

  //getter for user
  public getUser(): User | undefined {
    return this.user;
  }
  //getter for token
  public getToken(): string | undefined {
    return this.token;
  }
  //getter for csrfToken
  public getCsrfToken(): string | undefined {
    return this.csrfToken;
  }
  //get Headers
  public getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('jwt-token', this.token!)
      .set('X-CSRF-Token', this.csrfToken!);
  }


  //login
  public login(userName: string, password: string): Observable<LoginResponse | ErrorResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/auth/login`, {
      userName: userName,
      password: password
    }).pipe(
      tap(response => this.user = response.user),
      tap(response => localStorage.setItem('user', JSON.stringify(response.user))),
      tap(response => localStorage.setItem('token', response.token)),
      tap(response => localStorage.setItem('csrfToken', response.csrfToken)),
      catchError(this.handleError)
    );
  }

  //register
  public register(user: UserRegister): Observable<User | ErrorResponse> {
    return this.httpClient.post<User>(`${this.baseUrl}/auth/register`, user)
    .pipe(
      catchError(this.handleError)
    );
  }

  //Check if the user is authenticated
  public checkAuthenticationStatus(): Observable<boolean> {
    console.log('checkAuthenticationStatus 1')
    if (!localStorage.getItem('token')) return new Observable<boolean>(observer => observer.next(false));
    console.log('checkAuthenticationStatus 2')
    if (!localStorage.getItem('csrfToken')) return new Observable<boolean>(observer => observer.next(false));

    console.log('checkAuthenticationStatus 3')
    const token = localStorage.getItem('token');
    const csrfToken = localStorage.getItem('csrfToken');

    console.log('checkAuthenticationStatus 4', token, csrfToken);

    const headers = new HttpHeaders()
      .set('jwt-token', token!)
      .set('X-CSRF-Token', csrfToken!);

    return this.httpClient.get<LoginResponse>(`${this.baseUrl}/auth/renew-token`, {
      headers
    })
      .pipe(
        tap(response => console.log('checkAuthenticationStatus 5', response)),
        tap(response => this.user = response.user),
        tap(response => localStorage.setItem('user', JSON.stringify(response.user))),
        tap(user => localStorage.setItem('token', user.token!)),
        tap(user => localStorage.setItem('csrfToken', user.csrfToken!)),
        map(user => !!user),
        catchError(err => of(false))
      );
  }


  //logout
  public logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('csrfToken');
  }

//handle error
  private handleError(error: HttpErrorResponse): Observable<ErrorResponse> {
    let errorResponse: ErrorResponse = {
      error: 'Unknown Error',
      message: 'An unknown error occurred',
      validationErrorList: []
    };

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorResponse.message = error.error.message;
    } else {
      // Server-side error
      errorResponse = error.error;
    }
    return throwError(() => errorResponse);
  }







}
