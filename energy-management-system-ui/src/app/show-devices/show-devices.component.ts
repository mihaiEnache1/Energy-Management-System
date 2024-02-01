import { Component, OnInit } from '@angular/core';
import { Device } from '../model/device';
import { DeviceService } from '../service/device.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../service/admin.service';
import { User } from '../model/user';
import { MonitoringService } from '../service/monitoring.service';

@Component({
  selector: 'app-show-devices',
  templateUrl: './show-devices.component.html',
  styleUrls: ['./show-devices.component.css']
})
export class ShowDevicesComponent implements OnInit{
  deviceDetails: Device[] = [];
  displayedColumns: string[] = ['Description', 'Address', 'Maximum Hourly Energy Consumption', 'User', 'Edit', 'Delete'];
  userNamesMap = new Map<string, string>();

  constructor(private deviceService: DeviceService, private adminService: AdminService, private monitoringService: MonitoringService, private router: Router) { }

  ngOnInit(): void {
    console.log("!!!!!!!!!!!!!!!!!!!!!SHOW DEVICES COMPONENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.getAllDevices();
  }

  public getAllDevices() {
    console.log('!!!!!!!!!!!!!!!!!!!!!SHOW DEVICES COMPONENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    this.deviceService.getAllDevices().subscribe(
      (response: Device[]) => {
        // console.log(response);
        this.deviceDetails = response;
        this.fetchUserDetailsForDevices(this.deviceDetails);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  public deleteDevice(deviceUid: string, userUid: string) {
    console.log("!!!!!!!!!MA APELEEEEEZZZ!!!!!!!!");
    this.deviceService.delete(deviceUid).subscribe(
      (response) => {
        console.log("Am sters device-ul!");
        this.getAllDevices();
      },
      (error) => {
        console.log(error);
      }
    );
    this.monitoringService.deleteDevice(deviceUid).subscribe(
      (response) => {
        console.log("Am sters device-ul si din monitoring")
      },
      (error) => {
        console.log(error);
      }
    )
    // const username = this.userNamesMap.get(userUid);
    // if (username !== '-') {
    //   this.monitoringService.deleteDevice(deviceUid).subscribe(
    //     (response) => {
    //       console.log("Am sters device-ul din monitoring!");
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   )
    // }
  }

  public editDevice(deviceUid: string) {
    this.router.navigate(['/add-device', {deviceUid: deviceUid}]);
  }

  private fetchUserDetailsForDevices(devices: Device[]) {
    devices.forEach((device: Device) => {
      if (device.userUid === null) {
        this.userNamesMap.set(device.userUid, "-");
      } else {
        this.adminService.getUserByUid(device.userUid).subscribe(
          (user: User) => {
            this.userNamesMap.set(device.userUid, user.name);
          },
          (error: HttpErrorResponse) => {
            console.log('Error fetching user details for device: ${device.userUid}');
          }
        )
      }
    })
  }
}
