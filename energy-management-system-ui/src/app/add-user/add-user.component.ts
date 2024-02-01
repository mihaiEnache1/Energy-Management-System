import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  isNewUser = true;
  hide = true;
  role!: string;
  roles: string[] = ['ADMIN', 'CLIENT'];
  selectedRole: string = '';
  user: User = {
    uid: "",
    email: "",
    name: "",
    password: "",
    role: ""
  }

  constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.data['user'];
    if (this.user && this.user.uid) {
      this.isNewUser = false;
      this.selectedRole = this.user.role;
    }
  }

  addUser(userForm: NgForm) {
    this.user.role = this.selectedRole;
    if (this.isNewUser) {
      this.adminService.create(this.user).subscribe(
        (response: User) => {
          userForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.adminService.update(this.user, this.user.uid).subscribe(
        (response: User) => {
          userForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}
