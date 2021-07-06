import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.activeUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = true;
    if (isLoggedIn && isApiUrl) {
      debugger;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token.access}`,
        },
      });
    }

    return next.handle(request);
  }
}
