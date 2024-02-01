import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public setRole(jwtToken: string) {
    try {
      const decodedToken: { role: string } = jwt_decode(jwtToken);
  
      if (decodedToken && decodedToken.role) {
        sessionStorage.setItem('role', decodedToken.role);
      } else {
        console.error('JWT token does not contain a role.');
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  public getRole(): any {
    return sessionStorage.getItem('role');
  }

  public setToken(jwtToken: string) {
    sessionStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string|null { 
    return sessionStorage.getItem('jwtToken');
  }

  public clear() {
    sessionStorage.clear();
  }

  public isLoggedIn() {
    return this.getToken();
  }

  public isAdmin() {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  public isClient() {
    const role = this.getRole();
    return role === 'CLIENT';
  }

  public roleMatch(allowedRole: any): boolean {
    const userRole = this.getRole();
    return allowedRole === userRole;
  }

  public getUserUidFromToken() {
    const jwtToken = this.getToken();
    if (jwtToken) {
      try {
        const decodedToken: { userUid: string } = jwt_decode(jwtToken);
  
        if (decodedToken && decodedToken.userUid) {
          return decodedToken.userUid;
        } else {
          console.error('JWT token does not contain a user uid.');
          return null;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    } else {
      console.error('No token in the session storage');
      return null;
    }
  }
}