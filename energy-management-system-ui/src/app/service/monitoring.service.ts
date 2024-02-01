import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  API_PATH = "http://localhost:8082/monitoring-device";

  constructor(private http: HttpClient) { }

  private getRequestHeader(): HttpHeaders {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const requestHeader = new HttpHeaders({ "Authorization": "Bearer " + jwtToken });
    return requestHeader;
  }

  public deleteDevice(deviceUid: string) {
    console.log("Incerc sa sterg device din monitoring!!");
    return this.http.delete(this.API_PATH + "/" + deviceUid, { headers: this.getRequestHeader() });
  }
}
