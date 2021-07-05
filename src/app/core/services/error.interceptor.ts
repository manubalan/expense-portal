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
        } else if ([403].indexOf(err.status) !== -1) {
        }

        const error = err.error.message || err.statusText;
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
