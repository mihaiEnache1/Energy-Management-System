import { Injectable } from '@angular/core';
import { Message, Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';

interface SocketMessage {
  message: string;
  deviceUid: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient!: any;

  constructor() { }

  public connect(): Observable<any> {
    this.stompClient = Stomp.over(() => new SockJS("http://localhost:8082/socket"));
    return new Observable(observer => {
      this.stompClient.connect({}, () => {
        observer.next();
      })
    })
  }

  public subscribe(topic: string, callback: (message: SocketMessage) => void): void {
    this.stompClient.subscribe(topic, (message: Message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as SocketMessage;
        callback(parsedMessage)
      } catch (error) {
        console.error('Error parsing JSON:', message.body);
      }
    });
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
