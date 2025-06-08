import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  startConnection(roomId: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://18.191.119.189/hubs/room?roomId=${roomId}`) //updated to AWS server
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection established.'))
      .catch(err => console.error('Error while starting connection:', err));
  }

  sendCode(roomId: string, code: string): void {
    this.hubConnection.invoke('SendCode', roomId, code);
  }

  onCodeReceived(callback: (code: string) => void): void {
    this.hubConnection.on('ReceiveCode', callback);
  }
}
