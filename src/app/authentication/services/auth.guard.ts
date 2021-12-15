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
  pages: MenuModel[] = MENU;
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
    if (this.authenticationService.activeUser.user?.role_details.name)
      this.role =
        this.authenticationService?.activeUser?.user?.role_details?.name;

    if (this.authenticationService.isAuthenticated) {
      // if (this.authenticationService.activeUser.menu) this.pages = this.authenticationService.activeUser.menu;

      const navObj = MENU.filter(
        (el) =>
          el.link.toLowerCase().replace('/', '') ===
          route.routeConfig?.path?.toLowerCase()
      );
      if (!(navObj.length > 0 && navObj[0]?.hasAcess.includes(this.role))) {
        this.router.navigate(['/']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
