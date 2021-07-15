import { Component, Injectable } from '@angular/core';

@Component({
  selector: 'ems-loader',
  template: ` <div class="loader-bg" *ngIf="loaderService.loaderVisibility">
    <div class="clock-loader"></div>
  </div>`,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}

@Injectable()
export class LoaderService {
  loaderVisibility = false;

  show(): void {
    this.loaderVisibility = true;
  }

  hide(): void {
    this.loaderVisibility = false;
  }
}
