import { Component } from '@angular/core';
import { AuthService } from './authentication';
import { onMainContentChange } from './shared/animations/animations';

@Component({
  selector: 'ems-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [onMainContentChange],
})
export class AppComponent {
  title = 'expense-app';

  constructor(private authenticationService: AuthService) {
    // this.authenticationService.isAuthenticated.subscribe(el => {

    //   console.log(' CUrrent USER ------------>', el);
      
    //       });
  }
}
