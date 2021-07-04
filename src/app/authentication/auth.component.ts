import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ems-auth',
  template: `
    <div class="login-wrap">
      <div class="left-block">
        <img src="{{ baseUrl }}/assets/image/expense.jpg" alt="" />
      </div>
      <div class="right-block">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  baseUrl = environment.BASE_URL;

  constructor(private router: Router, private authService: AuthService) {
    // if(this.authService.getCurrentUser){

    // }

    if (localStorage.getItem('currentUser') !== null) {
      this.router.navigate(['/']);
    }
  }
}
