import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { onMainContentChange } from '../shared/animations/animations';
import { SidebarService } from '../shared/components/sidebar/sidebar.service';

@Component({
  selector: 'ems-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [onMainContentChange],
})
export class PagesComponent implements OnInit, OnDestroy {
  baseUrl = environment.BASE_URL;
  onSideBarChange = true;
  subscribe = new Subscription();

  constructor(private sidebarService: SidebarService) {
    this.subscribe = this.sidebarService.sideNavState$.subscribe((res) => {
      this.onSideBarChange = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
