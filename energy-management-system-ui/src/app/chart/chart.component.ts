import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { ChartService } from '../service/chart.service';
import { Consumption } from '../model/consumption';
import { DeviceService } from '../service/device.service';
import { UserAuthService } from '../service/user-auth.service';
import { Device } from '../model/device';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];
  consumptions: Consumption[] = [];
  userDevices!: Device[];
  devicesDescription!: string[];
  selectedDevice!: string;
  selectedDate!: Date;

  constructor(private chartService: ChartService, private deviceService: DeviceService, private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    const userUid = this.userAuthService.getUserUidFromToken();
    this.deviceService.getDevicesByUserUid(userUid).subscribe(
      (response) => {
        this.userDevices = response;
        this.devicesDescription = response.map(device => device.description);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  renderChart() {
    const device = this.userDevices.find(device => device.description === this.selectedDevice);
    const existingChart = Chart.getChart("barchart");
    if (existingChart) {
      existingChart.destroy();
      this.consumptions = [];
    }
    this.chartService.getConsumptionsByDeviceUid(device!.uid).subscribe(
      (response) => {
        this.consumptions = response.filter(consumption => {
          const consumptionDate = new String(consumption.timestamp);
          const dateComponents = consumptionDate.split('T');
          const [year, month, day] = dateComponents[0].split('-');
          const numericYear = parseInt(year, 10);
          const numericMonth = parseInt(month, 10);
          const numericDay = parseInt(day, 10);
          return ((numericYear === this.selectedDate.getFullYear()) && (numericMonth === (this.selectedDate.getMonth() + 1)) && numericDay === this.selectedDate.getDate())
        });
        console.log(this.consumptions);
        console.log(device?.maximumHourlyConsumption)
        const timestamps = this.consumptions.map(consumption => new String(consumption.timestamp));
        console.log(timestamps);
        this.labels = timestamps.map(timestamp => {
          const hourSubstring = timestamp.substring(timestamp.indexOf('T') + 1, timestamp.indexOf('T') + 3);
          return hourSubstring.startsWith('0') ? hourSubstring[1] : hourSubstring;
        });
        this.labels = this.labels.map(label => (Number(label) +2).toString());
        this.data = this.consumptions.map(consumption => consumption.energyValue);
        const backgroundColors = this.data.map(value => (value < device!.maximumHourlyConsumption) ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)');
        const chart = new Chart("barchart", {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: "energy value [kWh]",
              data: this.data,
              backgroundColor: backgroundColors,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
