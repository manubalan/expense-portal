import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from 'src/app/shared/components/sidebar/sidebar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ems-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
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
