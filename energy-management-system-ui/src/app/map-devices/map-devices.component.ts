import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { AdminService } from '../service/admin.service';
import { Device } from '../model/device';
import { DeviceService } from '../service/device.service';

@Component({
  selector: 'app-map-devices',
  templateUrl: './map-devices.component.html',
  styleUrls: ['./map-devices.component.css']
})
export class MapDevicesComponent implements OnInit {
  user: User | null = null;
  users: User[] = [];
  device: Device[] = [];
  devices: Device[] = [];

  constructor(private adminService: AdminService, private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe(
      (response) => {
        this.users = response.filter(user => user.role === 'CLIENT');
      },
      (error) => {
        console.log(error);
      }
    );
    this.deviceService.getAllDevices().subscribe(
      (response) => {
        this.devices = response;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  map() {
    const userUid = this.user!.uid;
    const devicesUid = this.device.map((device) => device.uid);

    this.deviceService.map(userUid, devicesUid).subscribe(
      (response) => {
        this.user = null;
        this.device = [];
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
