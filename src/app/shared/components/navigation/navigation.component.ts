import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ems-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @HostBinding('class.expanded') expandedMenu: boolean = false;
  baseUrl = environment.BASE_URL;

  @Input()
  expanded: boolean | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.expanded) {
        this.expandedMenu =
          this.expanded !== undefined && this.expanded ? true : false;
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
