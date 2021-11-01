import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MenuModel } from 'src/app/core';
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

  @Output()
  menuExpanded = new EventEmitter<boolean>();

  public pages: MenuModel[] = [
    { name: 'Dashboard', link: '/dashboard', icon: 'grid_view' },
    {
      name: 'Agreement',
      link: '',
      icon: 'list_alt',
      children: [
        {
          name: 'Agreements Details',
          link: '/dashboard/agreement/agreements-list',
          icon: 'request_quote',
        },
        {
          name: 'Vehicle Expense',
          link: '/dashboard/agreement/vehicle-expenses',
          icon: 'directions_car',
        },
        {
          name: 'Employee Expense',
          link: '/dashboard/agreement/exployee-expense',
          icon: 'groups',
        },
      ],
    },
    {
      name: 'Reports',
      link: '',
      icon: 'assessment',
      children: [
        {
          name: 'Employee Expense',
          link: '/dashboard/reports/exployee-wise-expense',
          icon: 'supervisor_account',
        },
        {
          name: 'Employee Expense (Date Wise)',
          link: '/dashboard/reports/exployee-expense',
          icon: 'perm_contact_calendar',
        },

        {
          name: 'Material Expense',
          link: '/dashboard/reports/vehicle-expense',
          icon: 'group_work',
        },
        {
          name: 'Vehicle Expense',
          link: '/dashboard/reports/driver-wise-expense',
          icon: 'local_shipping',
        },
        {
          name: 'Driver Expense',
          link: '/dashboard/reports/driver-expense',
          icon: 'commute',
        },
      ],
    },
    {
      name: 'Master Data',
      link: '',
      icon: 'storage',
      children: [
        {
          name: 'View Data',
          link: '/dashboard/master-data/view',
          icon: 'supervisor_account',
        },
      ],
    },
  ];

  constructor(private sidenavService: SidebarService) {
    this.selectedPage = 0;
    this.selectedChild = -1;
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
