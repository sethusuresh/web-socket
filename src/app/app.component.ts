import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {
  ws: any;
  disabled: boolean;
  showConversation: boolean = false;
  greetings: string[] = [];
  name: string;
  
  constructor(){

  }

  connect() {
    let socket = new WebSocket("ws://localhost:8091/websocket-example");
    this.ws = Stomp.over(socket);
    this.ws.connect({}, function(frame) {
      this.ws.subscribe("/errors", function(message) {
        alert("Error " + message.body);
      });
      this.ws.subscribe("/topic/user", function(message) {
        console.log(message)
        this.showGreeting(message.body);
      });
      this.disabled = true;
    }, function(error) {
      alert("STOMP error " + error);
    });
  }

  showGreeting(message) {
    this.showConversation = true;
    this.greetings.push(message)
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }

  sendMessage() {
    let data = JSON.stringify({
      'name' : this.name
    })
    this.ws.send("/app/user", {}, data);
  }
  
}

