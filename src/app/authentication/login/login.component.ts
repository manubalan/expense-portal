import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {
  ActiveUserModel,
  AuthResponseModel,
  ErrorResponseModel,
} from 'src/app/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ems-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  baseUrl = environment.BASE_URL;
  errorMessage = '';

  returnUrl = '';

  loginForm: FormGroup;
  activeUser: ActiveUserModel = {};

  constructor(
    private fBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fBuilder.group({
      email: ['', Validators.email],
      username: [''],
      password: ['', Validators.required],
    });

    this.authService.activeUser$.subscribe(
      (data: ActiveUserModel) => (this.activeUser = data)
    );
  }

  ngOnInit(): void {
    if (
      typeof this.route.snapshot.queryParams.returnUrl === 'string' &&
      this.route.snapshot.queryParams.returnUrl !== ''
    ) {
      this.returnUrl = this.route.snapshot.queryParams.returnUrl;
    } else {
      this.returnUrl = '/';
    }
  }

  get fControl(): any {
    return this.loginForm.controls;
  }

  loginNow(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.fControl.username.value, this.fControl.password.value)
      .pipe(first())
      .subscribe(
        (data: AuthResponseModel) => {
          this.errorMessage =
            !data.is_authenticated && data.message ? data.message : '';
          this.router.navigate([
            this.route.snapshot.queryParams.returnUrl
              ? this.route.snapshot.queryParams.returnUrl
              : '/',
          ]);
        }
      );
  }
}
