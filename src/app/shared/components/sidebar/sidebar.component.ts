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
  public selectedIndex: number;
  public sideNavState = false;
  public linkText = false;

  @Output()
  menuExpanded = new EventEmitter<boolean>();

  public pages: MenuModel[] = [
    { name: 'Dashboard', link: '/dashboard', icon: 'grid_view' },
    {
      name: 'Agreement',
      link: '',
      icon: 'description',
      children: [
        {
          name: 'Agreements Details',
          link: '/dashboard/agreement/',
          icon: 'description',
        },
      ],
    },
    {
      name: 'Reports',
      link: '',
      icon: 'receipt_long',
      children: [
        {
          name: 'Employee Expense',
          link: '/dashboard/reports/exployee-wise-expense',
          icon: 'supervisor_account',
        },
        {
          name: 'Employee Expense (Date Wise)',
          link: '/dashboard/reports/exployee-expense',
          icon: 'supervisor_account',
        },

        {
          name: 'Material Expense',
          link: '/dashboard/reports/vehicle-expense',
          icon: 'local_shipping',
        },
        {
          name: 'Vehicle Expense',
          link: '/dashboard/reports/driver-wise-expense',
          icon: 'people_alt',
        },
        {
          name: 'Driver Expense',
          link: '/dashboard/reports/driver-expense',
          icon: 'people_alt',
        },
      ],
    },
    { name: 'Master Data', link: '/dashboard/master-data', icon: 'storage' },
    // { name: 'Send email', link: 'some-link', icon: 'face' },
  ];

  constructor(private sidenavService: SidebarService) {
    this.selectedIndex = -1;
  }

  baseUrl = environment.BASE_URL;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.selectedIndex = -1;
    }
    this.wasInside = false;
  }

  expandMenu(): void {
    this.expanded = !this.expanded;
    this.selectedIndex = -1;
    this.menuExpanded.emit(this.expanded);
  }

  setIndex(item: MenuModel, index: number): boolean {
    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
      return false;
    }

    this.selectedIndex = index;
    if (item.children && item.children?.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  menuSelected(): void {
    this.selectedIndex = -1;
  }
}
