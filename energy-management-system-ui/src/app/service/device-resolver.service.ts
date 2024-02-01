import { Injectable } from '@angular/core';
import { DeviceService } from './device.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Device } from '../model/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceResolverService implements Resolve<Device>{

  constructor(private deviceService: DeviceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Device> {
    const uid = route.paramMap.get("deviceUid");
    if (uid) {
      // fetch details from backend
      return this.deviceService.getDeviceByUid(uid);
    } else {
      // return empty device observable
      return of(this.getDeviceDetails());
    }
  }

  getDeviceDetails() {
    return {
      uid: "",
      description: "",
      address: "",
      maximumHourlyConsumption: 0,
      userUid: ""
    };
  }
}
