import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { User } from '../model/user';
import { AdminService } from '../service/admin.service';
import { ChatMessage } from '../model/chat-message';
import { ChatService } from '../service/chat.service';
import { UserAuthService } from '../service/user-auth.service';
import { TypingNotification } from '../model/typing-notification';
import { ReadNotification } from '../model/read-notification';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  selectedUserUid: string | null = null;
  selectedUserName: string | null = null;
  messageInput: string = '';
  messageList: any[] = [];
  adminUid: string = '';
  isTyping: boolean = false;
  isReading: boolean = false;

  constructor(private adminService: AdminService, private chatService: ChatService, private userAuthService: UserAuthService) { }

  @ViewChildren('messagesContainer', { read: ElementRef })
  messagesContainer!: QueryList<ElementRef>;

  @ViewChild('typingIndicator', { read: ElementRef })
  typingIndicator!: ElementRef;

  @ViewChild('readingIndicator', { read: ElementRef })
  readingIndicator!: ElementRef;

  ngOnInit(): void {
    this.adminUid = this.userAuthService.getUserUidFromToken()!;
    this.adminService.getAllUsers().subscribe(
      (response) => {
        this.users = response.filter(user => user.role === 'CLIENT');
      },
      (error) => {
        console.log(error);
      }
    )
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  getSelectedUser() {
    if (this.selectedUserUid) {
      const selectedUid = this.selectedUserUid.toString();
      this.chatService.authenticate().subscribe(
        (response) => {
          const authToken = response;
          this.chatService.connect(selectedUid, authToken);
          this.listenerMessage();
        },
        (error) => {
          console.log(error);
        }
      )
      const selectedUser = this.users.find(user => user.uid === selectedUid);
      this.selectedUserName = selectedUser ? selectedUser.name : null;
    } else {
      this.selectedUserName = null;
    }
  }

  sendMessage() {
    const chatMessage = {
      message: this.messageInput,
      userUid: this.adminUid,
    } as ChatMessage;
    const selectedUid = this.selectedUserUid!.toString();
    this.chatService.sendMessage(selectedUid, chatMessage);
    this.messageInput = '';
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((message:any) => {
      console.log("Message received:", message);
      if (message.typing === undefined) {
        this.isTyping = false;
      }
      // if (message.read === undefined) {
      //   this.isReading = false;
      // }
      if (message.hasOwnProperty('typing')) {
        if (message.message === 'Client is typing') {
          this.isTyping = true;
          this.isReading = false;
        } else {
          this.isTyping = false;
        }
      } else if (message.hasOwnProperty('read')) {
        if (message.message === 'Client read messages' && this.messageList.length > 0) {
          console.log("Message list length: " + this.messageList.length);
          this.isReading = true;
        } else {
          this.isReading = false;
        }
      } else {
        this.messageList = message.map((item: any) => ({
          ...item,
          message_side: item.userUid === this.adminUid ? 'sender' : 'receiver'
        }))
      }
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messagesContainer.first.nativeElement;
      var totalHeight = container.scrollHeight;

      if (this.isTyping) {
        const typingIndicatorDiv = this.typingIndicator?.nativeElement;
        if (typingIndicatorDiv) {
          totalHeight += typingIndicatorDiv.scrollHeight;
        }
      }

      if (this.isReading) {
        const readingIndicatorDiv = this.readingIndicator?.nativeElement;
        if (readingIndicatorDiv) {
          totalHeight += readingIndicatorDiv.scrollHeight;
        }
      }

      container.scrollTop = totalHeight;
    })
  }

  onInput(event: any) {
    if (event.target.value.length > 0) {
      const typingNotification: TypingNotification = {
        message: 'Admin is typing',
        typing: true
      }
      this.chatService.sendTypingNotification(this.selectedUserUid!, typingNotification);
    } else {
      const typingNotification: TypingNotification = {
        message: '',
        typing: false
      }
      this.chatService.sendTypingNotification(this.selectedUserUid!, typingNotification);
    }
  }

  onFocus() {
    const hasUnreadMessages = this.messageList.some(item => item.message_side === 'receiver');

    if (hasUnreadMessages) {
      const readNotification: ReadNotification = {
        message: 'Admin read messages',
        read: true
      }
      this.chatService.sendReadMessagesNotification(this.selectedUserUid!, readNotification);
    }
  }

  onBlur() {
    if (this.isTyping === true) {
      this.isReading = false;
    }
    this.isTyping = false;
  }

  calculateChatListHeight(): string {
    const totalUsers = this.users.length;
    
    const calculatedHeight = `${totalUsers * 50}px`;
    return calculatedHeight;
  }

  isCurrentUserSender(): boolean {
    const lastMessage = this.messageList[this.messageList.length - 1];
    return lastMessage && lastMessage.message_side === 'sender';
  }
}
