import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consumption } from '../model/consumption';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  private getRequestHeader(): HttpHeaders {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const requestHeader = new HttpHeaders({ "Authorization": "Bearer " + jwtToken });
    return requestHeader;
  }

  public getConsumptionsByDeviceUid(deviceUid: string) {
    return this.http.get<Consumption[]>('http://localhost:8082/consumptions/' + deviceUid, { headers: this.getRequestHeader() });
  }
}
