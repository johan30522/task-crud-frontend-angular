import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../auth/interfaces/user.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ErrorResponse } from '../../shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl: string = environment.baseUrl;

  constructor(

    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

  //update profile
  public UpdateUserProfile(user: User): Observable<User| ErrorResponse> {
    return this.httpClient.put<User>(`${this.baseUrl}/user/${user.id}`, user, { headers: this.authService.getHeaders() }).pipe(
      tap(user => this.authService.setUser(user)),
      catchError(this.handleError)
    );
  }

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
