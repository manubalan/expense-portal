import { Component } from '@angular/core';

@Component({
  selector: 'ems-reports',
  template: `
    <router-outlet></router-outlet>
    <ems-loader></ems-loader>
  `,
})
export class ReportsComponent {}
