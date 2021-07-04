import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav/sidenav';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ems-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  baseUrl = environment.BASE_URL;

  @Input()
  sidenav!: MatSidenav;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    
  }
}
