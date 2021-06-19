import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SidebarService {
  public sideNavState$: Subject<boolean> = new Subject();

  constructor() {}
}
