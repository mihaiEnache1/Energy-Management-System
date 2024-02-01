import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  API_PATH = "http://localhost:8080/admin";

  constructor(private http: HttpClient) { }

  private getRequestHeader(): HttpHeaders {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const requestHeader = new HttpHeaders({ "Authorization": "Bearer " + jwtToken });
    return requestHeader;
  }

  public create(user: User) {
    return this.http.post<User>(this.API_PATH, user, { headers: this.getRequestHeader() });
  }

  public getAllUsers() {
    return this.http.get<User[]>(this.API_PATH, { headers: this.getRequestHeader() });
  }

  public getUserByUid(userUid: string) {
    return this.http.get<User>(this.API_PATH + "/" + userUid, { headers: this.getRequestHeader() });
  }

  public update(user: User, userUid: string) {
    return this.http.put<User>(this.API_PATH + "/" + userUid, user, { headers: this.getRequestHeader() });
  }

  public delete(userUid: string) {
    return this.http.delete(this.API_PATH + "/" + userUid, { headers: this.getRequestHeader() });
  }
}
