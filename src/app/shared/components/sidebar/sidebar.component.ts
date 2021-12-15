import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/authentication';
import { MENU, MenuModel } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'ems-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @HostBinding('class.expanded') expanded: boolean = false;
  private wasInside = false;
  public selectedPage: number;
  public selectedChild: number;
  public sideNavState = false;
  public linkText = false;
  public pages: MenuModel[] = [];

  @Output()
  menuExpanded = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {
    this.selectedPage = 0;
    this.selectedChild = -1;
    // if (this.authService.activeUser.menu) this.pages = this.authService.activeUser.menu;

    let role = '';
    if (this.authService.activeUser.user?.role_details.name)
      role = this.authService?.activeUser?.user?.role_details?.name
        ? this.authService?.activeUser?.user?.role_details?.name
        : '';
    if (role) this.pages = MENU.filter((item) => item.hasAcess.includes(role));
  }

  baseUrl = environment.BASE_URL;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.selectedPage = -1;
    }
    this.wasInside = false;
  }

  expandMenu(): void {
    this.expanded = !this.expanded;
    this.selectedPage = -1;
    this.menuExpanded.emit(this.expanded);
  }

  setPageIndex(item: MenuModel, index: number): boolean {
    if (this.selectedPage === index) {
      this.selectedPage = -1;
      return false;
    }

    this.selectedPage = index;
    if (item.children && item.children?.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  setChildIndex(index: number): void {
    this.selectedChild = index;
    this.selectedPage = -1;
  }
}
