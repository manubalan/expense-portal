import { Component, OnInit } from '@angular/core';
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
    { name: 'Agreement', link: '/agreement', icon: 'description' },
    // { name: 'Starred', link: '/', icon: 'local_shipping' },
    // { name: 'Send email', link: 'some-link', icon: 'face' },
  ];

  constructor(private sidenavService: SidebarService) {}

  ngOnInit(): void {}

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sidenavService.sideNavState$.next(this.sideNavState);
  }
}
