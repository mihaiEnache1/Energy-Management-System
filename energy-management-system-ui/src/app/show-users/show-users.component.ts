import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../service/admin.service';
import { DeviceService } from '../service/device.service';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit {
  userDetails: User[] = [];
  displayedColumns: string[] = ['Name', 'Email', 'Role', 'Edit', 'Delete'];

  constructor(private adminService: AdminService, private router: Router, private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  public getAllUsers() {
    console.log(localStorage.getItem("jwtToken"));
    this.adminService.getAllUsers().subscribe(
      (response: User[]) => {
        this.userDetails = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  public deleteUser(userUid: string) {
    this.deviceService.unassign(userUid).subscribe(
      (response) => {
        this.adminService.delete(userUid).subscribe(
          (response) => {
            console.log(response);
            this.getAllUsers();
          },
          (error) => {
            console.log(error);
          }
        )
      },
      (error) => {
        console.log(error);
      }
    )
    // this.adminService.delete(userUid).subscribe(
    //   (response) => {
    //     this.deviceService.unassign(userUid).subscribe(
    //       (response) => {
    //         console.log(response);
    //       }, 
    //       (error) => {
    //         console.log(error);
    //       }
    //     )
    //     this.getAllUsers();
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // )
  }

  public editUser(userUid: string) {
    this.router.navigate(['/add-user', {userUid: userUid}]);
  }
}
