import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent{

  socket?: Socket;
  name = '';
  isNameEntered = false;
  message = '';
  messages: { user: string, text: string }[] = [];

  joinChat() {
    if (this.name.trim()) {
      this.isNameEntered = true;
      this.connectSocket();
    }
  }
  connectSocket() {
    this.socket = io("http://localhost:3000", {
      auth: {
        username: this.name
      }
    });
    this.socket.on("message", (data) => {
      this.messages.push(data);
    });
    this.socket.on("user_connected", (data) => {
      console.log("User connected:", data);
    });
    this.socket.on("user_disconnected", (data) => {
      console.log("User disconnected:", data);
    });
  }

  sendMessage() {
    if (this.message.trim() && this.socket) {
      const data = { user: this.name, text: this.message };
      console.log("Sending message:", data);
      this.socket.emit("message", data);
      this.message = "";
    }
  }

}
