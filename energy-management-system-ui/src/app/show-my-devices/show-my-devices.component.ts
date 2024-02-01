import { Component, OnInit } from '@angular/core';
import { Device } from '../model/device';
import { DeviceService } from '../service/device.service';
import { UserAuthService } from '../service/user-auth.service';

@Component({
  selector: 'app-show-my-devices',
  templateUrl: './show-my-devices.component.html',
  styleUrls: ['./show-my-devices.component.css']
})
export class ShowMyDevicesComponent implements OnInit {
  deviceDetails: Device[] = [];
  displayedColumns: string[] = ['Description', 'Address', 'Maximum Hourly Energy Consumption'];
  notifications: string[] = [];

  constructor(private deviceService: DeviceService, private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    const userUid = this.userAuthService.getUserUidFromToken();
    this.getDevices(userUid);
  }

  getDevices(userUid: any) {
    this.deviceService.getDevicesByUserUid(userUid).subscribe(
      (response: Device[]) => {
        this.deviceDetails = response;
      }
    )
  }
}
