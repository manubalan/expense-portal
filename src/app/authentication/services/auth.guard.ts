import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
} from '@angular/router';
import { MENU, MenuModel } from 'src/app/core';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentState: any;
  role: string = '';
  menu: MenuModel[] = MENU;
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
    const urlArray = state.url.split('/');
    if (this.authenticationService.isAuthenticated) {
      if (this.authenticationService.activeUser.menu)
        this.menu = this.authenticationService.activeUser.menu;

      if (urlArray.length > 2) {
        if (
          !(
            this.menu.length > 0 &&
            this.menu
              .find((el) => el.link === urlArray[2])
              ?.children?.find((child) => child.link === state.url)
          )
        ) {
          this.router.navigate(['/']);
          return false;
        }
      } else {
        if (
          !(
            this.menu.length > 0 &&
            this.menu.find((el) => el.link === urlArray[1])
          )
        ) {
          this.router.navigate(['/']);
          return false;
        }
      }

      return true;
    }

    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}
