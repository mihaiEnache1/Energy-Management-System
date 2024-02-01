import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { UserAuthService } from '../service/user-auth.service';
import { ChatMessage } from '../model/chat-message';
import { ActivatedRoute, Router } from '@angular/router';
import { TypingNotification } from '../model/typing-notification';
import { ReadNotification } from '../model/read-notification';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  userUid: string = "";
  username: string = "";
  messageInput: string = '';
  messageList: any[] = [];
  isTyping: boolean = false;
  isReading: boolean = false;

  constructor(private userAuthService: UserAuthService, private chatService: ChatService, private route: ActivatedRoute, private router: Router) { }

  @ViewChildren('messagesContainer', { read: ElementRef })
  messagesContainer!: QueryList<ElementRef>;

  @ViewChild('typingIndicator', { read: ElementRef })
  typingIndicator!: ElementRef;

  @ViewChild('readingIndicator', { read: ElementRef })
  readingIndicator!: ElementRef;

  ngOnInit(): void {
    if (this.userAuthService.isLoggedIn()) {
      this.messagesContainer = new QueryList<ElementRef>();
      this.route.params.subscribe(params => {
        this.userUid = params['uid'];
        this.chatService.authenticate().subscribe(
          (response) => {
            console.log(response);
            const authToken = response;
            this.chatService.connect(this.userUid, authToken);
            this.listenerMessage();
          },
          (error) => {
            
          }
        )
      })
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  sendMessage() {
    const chatMessage = {
      message: this.messageInput,
      userUid: this.userUid,
    } as ChatMessage;
    this.chatService.sendMessage(this.userUid, chatMessage);
    this.messageInput = '';
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((message: any) => {
      console.log("Message received:", message);
      if (message.typing === undefined) {
        this.isTyping = false;
      }
      // if (message.read === undefined) {
      //   this.isReading = false;
      // }
      if (message.hasOwnProperty('typing')) {
        if (message.message === 'Admin is typing') {
          this.isTyping = true;
          this.isReading = false;
        } else {
          this.isTyping = false;
        }
      } else if (message.hasOwnProperty('read')) {
        if (message.message === 'Admin read messages' && this.messageList.length > 0) {
          this.isReading = true;
        } else {
          this.isReading = false;
        }
      } else {
        this.messageList = message.map((item: any) => ({
          ...item,
          message_side: item.userUid === this.userUid ? 'sender' : 'receiver'
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
          console.log(readingIndicatorDiv.scrollHeight)
          totalHeight += readingIndicatorDiv.scrollHeight;
        }
      }

      container.scrollTop = totalHeight;
    });
  }

  onInput(event: any) {
    if (event.target.value.length > 0) {
      const typingNotification: TypingNotification = {
        message: 'Client is typing',
        typing: true
      }
      this.chatService.sendTypingNotification(this.userUid, typingNotification);
    } else {
      const typingNotification: TypingNotification = {
        message: '',
        typing: false
      }
      this.chatService.sendTypingNotification(this.userUid, typingNotification);
    }
    console.log("Reading:" + this.isReading);
    console.log("Typing:" + this.isTyping);
  }

  onFocus() {
    const hasUnreadMessages = this.messageList.some(item => item.message_side === 'receiver');

    if (hasUnreadMessages) {
      const readNotification: ReadNotification = {
        message: 'Client read messages',
        read: true
      }
      this.chatService.sendReadMessagesNotification(this.userUid, readNotification);
    }

    console.log("Reading:" + this.isReading);
    console.log("Typing:" + this.isTyping);
  }

  onBlur() {
    if (this.isTyping === true) {
      this.isReading = false;
    }
    this.isTyping = false;
    console.log("Reading:" + this.isReading);
    console.log("Typing:" + this.isTyping);
  }

  isCurrentUserSender(): boolean {
    const lastMessage = this.messageList[this.messageList.length - 1]
    return lastMessage && lastMessage.message_side === 'sender';
  }
}
