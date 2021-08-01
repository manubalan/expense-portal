import { Component, OnInit } from '@angular/core';
import { MenuModel } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { animateText, onSideNavChange } from '../../animations/animations';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'ems-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class SidebarComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;

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
        }
      ]
    },
    {
      name: 'Reports',
      link: '',
      icon: 'receipt_long',
      children: [
        {
          name: 'Employee Expense',
          link: '/dashboard/reports/exployee-expense',
          icon: 'supervisor_account',
        },
        {
          name: 'Employee Wise Expense',
          link: '/dashboard/reports/exployee-wise-expense',
          icon: 'supervisor_account',
        },
        {
          name: 'Vehicle Expense',
          link: '/dashboard/reports/vehicle-expense',
          icon: 'local_shipping',
        },
        {
          name: 'Driver Wise Expense',
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

  constructor(private sidenavService: SidebarService) {}
  baseUrl = environment.BASE_URL;
  ngOnInit(): void {}

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sidenavService.sideNavState$.next(this.sideNavState);
  }
}
