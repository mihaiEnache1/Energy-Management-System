import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../model/chat-message';
import { BehaviorSubject } from 'rxjs';
import { TypingNotification } from '../model/typing-notification';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReadNotification } from '../model/read-notification';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  API_PATH = "http://localhost:8084/authentication/token";
  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor(private http: HttpClient) { }

  private getRequestHeader(): HttpHeaders {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const requestHeader = new HttpHeaders({ "Authorization": "Bearer " + jwtToken });
    return requestHeader;
  }

  public authenticate() {
    return this.http.get<string>(this.API_PATH, { headers: this.getRequestHeader() });
  }

  connect(userRoomUid: string, authToken: string) {
    const url = "http://localhost:8084/chat-socket?authentication=" + authToken;
    this.stompClient = Stomp.over(() => new SockJS(url));
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${userRoomUid}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        this.messageSubject.next(messageContent);
      })
      this.stompClient.send(`/chat/${userRoomUid}/history`, {})
    })
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  sendMessage(userRoomUid: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/chat/${userRoomUid}`, {} , JSON.stringify(chatMessage))
  }

  sendTypingNotification(userRoomUid: string, typingMessage: TypingNotification) {
    this.stompClient.send(`/chat/${userRoomUid}/typing`, {}, JSON.stringify(typingMessage))
  }

  sendReadMessagesNotification(userRoomUid: string, readMessageNotification: ReadNotification) {
    this.stompClient.send(`/chat/${userRoomUid}/read`, {}, JSON.stringify(readMessageNotification))
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
}
