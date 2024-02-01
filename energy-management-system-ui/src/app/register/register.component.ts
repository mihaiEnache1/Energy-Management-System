import { Component } from '@angular/core';
import { RegistrationRequest } from '../model/registration-request';
import { AuthService } from '../service/auth.service';
import { UserAuthService } from '../service/user-auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  hide = true;
  registrationRequest: RegistrationRequest = {
    name: "",
    email: "",
    password: "",
  }

  constructor(private authService: AuthService, private userAuthService: UserAuthService, private router: Router) { }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  register(registerForm: NgForm) {
    this.authService.register(registerForm.value).subscribe(
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
}
