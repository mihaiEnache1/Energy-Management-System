import { Component } from '@angular/core';
import { AuthenticationRequest } from '../model/authentication-request';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../service/user-auth.service';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  authenticationRequest: AuthenticationRequest = {
    email: "",
    password: ""
  }

  constructor (private authService: AuthService, private userAuthService: UserAuthService, private adminService: AdminService, private router: Router) { }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  authenticate(loginForm: NgForm) {
    this.authService.authenticate(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setToken(response.token);
        this.userAuthService.setRole(response.token);
        this.router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }
  
  signUp() {
    this.router.navigate(['/register'])
  }
}
