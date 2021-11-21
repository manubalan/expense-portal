import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UserModel } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ems-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @HostBinding('class.expanded') expandedMenu: boolean = false;
  profileBox = false;
  name = {
    firstName: '',
    lastName: '',
  };
  profilePic = {
    url: '',
    active: false,
  };

  @Input()
  expanded: boolean | undefined;
  currentUser: UserModel;

  constructor(private authService: AuthService, private renderer: Renderer2) {
    this.currentUser = JSON.parse(
      localStorage.getItem('activeUser') || '{}'
    ).user;

    this.currentUser.role_details.name =
      this.currentUser?.role_details?.name.toLowerCase();

    this.name = {
      firstName: this.currentUser.first_name
        ? this.currentUser.first_name?.charAt(0)
        : 'N',
      lastName: this.currentUser.last_name
        ? this.currentUser.last_name?.charAt(0)
        : 'N',
    };

    if (this.currentUser.profile_pic)
      this.profilePic = {
        url: this.currentUser.profile_pic,
        active: true,
      };
    else
      this.profilePic = {
        url: '',
        active: false,
      };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.expanded) {
        this.expandedMenu =
          this.expanded !== undefined && this.expanded ? true : false;
      }
    }
  }

  toggleProfile(): void {
    this.profileBox = !this.profileBox;
  }

  logout(): void {
    this.authService.logout();
  }
}
