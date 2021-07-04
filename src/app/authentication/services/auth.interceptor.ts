import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (this.authenticationService.getToken()) {
    //   request = this.addToken(
    //     request,
    //     this.authenticationService.getToken().access
    //   );
    // }
    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authenticationService.activeUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isApiUrl = true;
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.authenticationService.logout();

          location.reload(true);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
