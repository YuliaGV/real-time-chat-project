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
  messages: { user: string, text: string, avatarColor: string }[] = [];
  notifications: { message: string, timestamp: Date }[] = [];
  avatarColor: string = '#007bff';
  userNameError: string = '';

  joinChat() {
    if (this.name.trim()) {
      this.isNameEntered = true;
      this.connectSocket();
    }
  }
  connectSocket() {
    this.socket = io("http://localhost:3000", {
      auth: {
        username: this.name,
        avatarColor: this.avatarColor
      }
    });

    this.socket.on('connect', () => {
      this.userNameError = '';
    });

    this.socket.on("username_error", (err) => {
      const translations: Record<string, string> = {
        'Username already taken': 'El nombre de usuario ya está en uso',
      };
      const errMsg = typeof err === 'string' ? err : (err?.message ?? '');
      this.userNameError = translations[errMsg] ?? 'Error desconocido. Inténtalo de nuevo.';
      this.isNameEntered = false;
      this.socket?.disconnect();
    });

    this.socket.on("message", (data) => {
      this.messages.push(data);
    });

    this.socket.on("user_connected", (data) => {
      this.notifications.push({ message: `${data.username} se unió al chat.`, timestamp: new Date() });
    });

    this.socket.on("user_disconnected", (data) => {
      this.notifications.push({ message: `${data.username} ha salido del chat.`, timestamp: new Date() });
    });
  }

  sendMessage() {
    if (this.message.trim() && this.socket) {
      const data = { user: this.name, text: this.message, avatarColor: this.avatarColor };
      console.log("Sending message:", data);
      this.socket.emit("message", data);
      this.message = "";
    }
  }

  getContrastColor(hexColor: string): string {
    // Remove the hash if it's there
    hexColor = hexColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Return black for light colors and white for dark colors
    return brightness > 125 ? '#000000' : '#FFFFFF';
  }

}
