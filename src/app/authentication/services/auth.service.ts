import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LoggedUserModel,
  API_END_POINT,
  AuthResponseModel,
  RoleModel,
  TokenModel,
  UserModel,
  ActiveUserModel,
} from 'src/app/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private activeUserSubject: BehaviorSubject<LoggedUserModel>;
  public activeUser$: Observable<ActiveUserModel>;

  constructor(private http: HttpClient, private router: Router) {
    this.activeUserSubject = new BehaviorSubject<LoggedUserModel>(
      JSON.parse(localStorage.getItem('activeUser') || '{}')
    );
    this.activeUser$ = this.activeUserSubject.asObservable();
  }

  public get activeUser(): LoggedUserModel {
    return JSON.parse(localStorage.getItem('activeUser') || '{}');
  }

  public getUser(): UserModel {
    return this.activeUser.user
      ? this.activeUser.user
      : { id: 0, username: '' };
  }

  public getRole(): RoleModel {
    return JSON.parse(localStorage.getItem('role') || '{}');
  }

  public getToken(): TokenModel {
    return this.activeUser.token
      ? this.activeUser.token
      : { refresh: '', access: '' };
  }

  public setToken(token: TokenModel): void {
    this.activeUser.token = token;

    localStorage.setItem('activeUser', JSON.stringify(this.activeUser));
    localStorage.setItem('abcc', 'xyz');
  }

  public isLoggedIn(): boolean {
    return !!this.getUser() && !!this.getToken();
  }

  public get activeUserValue(): any {
    if (
      this.activeUserSubject.value &&
      Object.keys(this.activeUser).length > 0
    ) {
      return this.activeUserSubject.value;
    } else {
      return {};
    }
  }

  public get isAuthenticated(): boolean {
    return !!(
      this.activeUserSubject.value && Object.keys(this.activeUser).length > 0
    );
  }

  login(username: string, password: string): any {
    return this.http
      .post<any>(API_END_POINT.authentication, {
        username: 'admin',
        password: 'Jothil@29',
      })
      .pipe(
        map((response: AuthResponseModel) => {
          const { message, ...loggedData } = response;
          if (response && response.token) {
            localStorage.setItem('activeUser', JSON.stringify(loggedData));
            this.activeUserSubject.next(loggedData);
          }

          return loggedData;
        })
      );
  }

  logout(): void {
    this.activeUserSubject.next({});
    this.activeUserSubject.complete();
    localStorage.removeItem('activeUser');
    this.router.navigate(['/auth']);
  }

  refreshToken(): Observable<any> {
    return this.http
      .post<any>(API_END_POINT.auth_refresh, {
        refresh: this.getToken().refresh,
      })
      .pipe(
        tap((tokens: TokenModel) => {
          this.setToken(tokens);
        })
      );
  }
}
