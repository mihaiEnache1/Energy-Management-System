import { Component } from '@angular/core';
import { Device } from '../model/device';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DeviceService } from '../service/device.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  isNewDevice = true;
  device: Device = {
    uid: "",
    description: "",
    address: "",
    maximumHourlyConsumption: 0,
    userUid: ""
  }

  constructor(private deviceService: DeviceService, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.device = this.activatedRoute.snapshot.data['device'];
    if (this.device && this.device.uid) {
      this.isNewDevice = false;
    }
  }

  addDevice(deviceForm: NgForm) {
    if (this.isNewDevice) {
      this.deviceService.create(this.device).subscribe(
        (response: Device) => {
          deviceForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.deviceService.update(this.device, this.device.uid).subscribe(
        (response: Device) => {
          deviceForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
  }
}
