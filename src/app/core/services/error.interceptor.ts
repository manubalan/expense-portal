import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { TokenModel } from '../models/auth.model';
import { SnackBarService } from 'src/app/shared';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = true;
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token.access}`,
        },
      });

      if (request.method.toUpperCase() === 'POST' || request.method.toUpperCase() === 'PUT') {
        request = request.clone({
          body: { ...request.body, user: currentUser?.user?.id ? currentUser?.user?.id : null},
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authenticationService.refreshToken().pipe(
              switchMap((token: TokenModel) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token.access);
                return next.handle(this.addToken(request, token.access));
              })
            );
          } else {
            if (this.refreshTokenSubject.value != null) {
              return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((jwt) => {
                  return next.handle(this.addToken(request, jwt));
                })
              );
            } else {
              this.authenticationService.logout();
            }
          }
        }
        
        if ([403].indexOf(err.status) !== -1) {
          this.authenticationService.logout();
        }

        if ([400].indexOf(err.status) !== -1) {
        }

        const error = err.error.message;
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): any {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
