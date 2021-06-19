import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { onMainContentChange } from './shared/animations/animations';
import { SidebarService } from './shared/components/sidebar/sidebar.service';

@Component({
  selector: 'ems-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [onMainContentChange],
})
export class AppComponent implements OnDestroy {
  title = 'expense-app';
  onSideBarChange = true;
  subscribe = new Subscription();

  constructor(private sidebarService: SidebarService) {
    this.subscribe = this.sidebarService.sideNavState$.subscribe((res) => {
      this.onSideBarChange = res;
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
