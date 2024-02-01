import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AdminService } from './admin.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User>{

  constructor(private adminService: AdminService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    const uid = route.paramMap.get("userUid");
    if (uid) {
      // fetch details from backend
      return this.adminService.getUserByUid(uid);
    } else {
      // return empty user observable
      return of(this.getUserDetails());
    }
  }

  getUserDetails() {
    return {
      uid: "",
      email: "",
      name: "",
      password: "",
      role: ""
    };
  }
}
