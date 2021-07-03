import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthResponseModel, ErrorResponseModel } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'ems-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  hide = true;
  baseUrl = environment.BASE_URL;
  errorMessage = '';

  returnUrl = '';

  loginForm: FormGroup;

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
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  loginNow(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data: AuthResponseModel) => {
          this.router.navigate([this.returnUrl]);
          console.log('------- ', data);
          console.log('===== ', this.returnUrl);
          

        },
        (error: ErrorResponseModel) => {
          if (error.status === 400 && error.error.message) {
            this.errorMessage = error.error.message;
          }
          // this.error = error;
          // this.loading = false;
          console.log('------- 44 ---  ', error);
        }
      );
  }
}
