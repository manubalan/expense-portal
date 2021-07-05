import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { animateText, onSideNavChange } from '../../animations/animations';
import { SidebarService } from './sidebar.service';
interface Page {
  link: string;
  name: string;
  icon: string;
}
@Component({
  selector: 'ems-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class SidebarComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;

  public pages: Page[] = [
    { name: 'Dashboard', link: '/home', icon: 'grid_view' },
    { name: 'Agreement', link: '/dashboard/agreement', icon: 'description' },
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
