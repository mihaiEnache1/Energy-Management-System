import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationRequest } from '../model/authentication-request';
import { RegistrationRequest } from '../model/registration-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_PATH = "http://localhost:8080/auth";
  requestHeader = new HttpHeaders(
    { "No-Auth": "True" }
  );

  constructor(private http: HttpClient) { }

  public authenticate(authenticationRequest: AuthenticationRequest) {
    return this.http.post(this.API_PATH + "/authenticate", authenticationRequest, { headers: this.requestHeader });
  }

  public register(registrationRequest: RegistrationRequest) {
    return this.http.post(this.API_PATH + "/register", registrationRequest, { headers: this.requestHeader });
  }
}
