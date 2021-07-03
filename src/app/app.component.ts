import { Component } from '@angular/core';
import { onMainContentChange } from './shared/animations/animations';

@Component({
  selector: 'ems-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [onMainContentChange],
})
export class AppComponent {
  title = 'expense-app';

  constructor() {}
}
