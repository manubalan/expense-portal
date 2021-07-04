import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  currentState: any;
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  redirectNow(state: RouterStateSnapshot): void {
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.currentState = state;
    if (this.authenticationService.isAuthenticated) {
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      //     // role not authorised so redirect to home page
      //     this.router.navigate(['/']);
      //     return false;
      // }

      return true;
    }

    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canLoad(): boolean {
    if (this.authenticationService.isAuthenticated) {
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      //     // role not authorised so redirect to home page
      //     this.router.navigate(['/']);
      //     return false;
      // }

      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}
