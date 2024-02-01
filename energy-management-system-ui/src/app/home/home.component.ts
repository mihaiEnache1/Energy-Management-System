import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../service/websocket.service';
import { UserAuthService } from '../service/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from '../service/device.service';

interface SocketMessage {
  message: string;
  deviceUid: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private userAuthService: UserAuthService, private webSocketService: WebsocketService, private toastr: ToastrService, private deviceService: DeviceService) { }

  ngOnInit(): void {
    if (this.userAuthService.isLoggedIn() && this.userAuthService.isClient()) {
      this.connectWebSocket();
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }


  private connectWebSocket(): void {
    this.webSocketService.connect().subscribe(() => {
      this.webSocketService.subscribe('/topic/socket/client', (message: SocketMessage) => {
        const userUid = this.userAuthService.getUserUidFromToken();
        this.deviceService.getDevicesByUserUid(userUid).subscribe(
          (response) => { 
            const devices = response;
            if (devices.length > 0) {
              devices.forEach(device => {
                if (device.uid === message.deviceUid) {
                  this.toastr.warning(message.message, "Hourly Consumption Excedeed", {
                    "closeButton": true,
                    "timeOut": 2000,
                    "progressBar": true,
                    "progressAnimation": 'increasing'
                  })
                }
              })
            }
          }, (error) => {
            console.log(error);
          }
        )
      })
    })
  }
}
