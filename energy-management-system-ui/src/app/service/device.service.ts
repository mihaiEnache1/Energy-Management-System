import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../model/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  API_PATH = "http://localhost:8081/devices";

  constructor(private http: HttpClient) { }

  private getRequestHeader(): HttpHeaders {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const requestHeader = new HttpHeaders({ "Authorization": "Bearer " + jwtToken });
    return requestHeader;
  }

  public create(device: Device) {
    return this.http.post<Device>(this.API_PATH, device, { headers: this.getRequestHeader() });
  }

  public getAllDevices() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    return this.http.get<Device[]>(this.API_PATH, { headers:  this.getRequestHeader() });
  }

  public getDeviceByUid(deviceUid: string) {
    return this.http.get<Device>(this.API_PATH + "/get-device/" + deviceUid, { headers: this.getRequestHeader() });
  }

  public getDevicesByUserUid(userUid: any) {
    return this.http.get<Device[]>(this.API_PATH + "/" + userUid, { headers: this.getRequestHeader() });
  }

  public update(device: Device, deviceUid: string) {
    return this.http.put<Device>(this.API_PATH + "/" + deviceUid, device, { headers: this.getRequestHeader() });
  }

  public delete(deviceUid: string) {
    return this.http.delete(this.API_PATH + "/" + deviceUid, { headers: this.getRequestHeader() });
  }

  public map(userUid: string, devicesUid: string[]) {
    const requestBody = {
      devicesUid: devicesUid
    };
    const jwtToken = sessionStorage.getItem("jwtToken");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + jwtToken
    })
    return this.http.put(this.API_PATH + "/map/" + userUid, JSON.stringify(requestBody), { headers: headers });
  }

  public getAllFreeDevices() {
    return this.http.get<Device[]>(this.API_PATH + "/free-devices", { headers: this.getRequestHeader() });
  }

  public unassign(userUid: string) {
    return this.http.delete(this.API_PATH + "/delete-user-id/" + userUid, { headers: this.getRequestHeader() });
  }
}
