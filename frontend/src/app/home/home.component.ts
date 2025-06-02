import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private http: HttpClient) {}

  createRoom(): void {
    interface Room {
      roomID: string;
    }
    // Angular POST call example:
    this.http.post<Room>('http://localhost:5098/api/room', {})
      .subscribe({
        next: (room) => {
          console.log('Room created with ID:', room.roomID);
          if (room.roomID) {
            // Navigate with the roomID to /room/:id
            this.router.navigate(['/room', room.roomID]);
          } else {
            console.error('roomID is undefined');
          }
        },
        error: (err) => {
          console.error('Error creating room:', err);
        }
    });
  }
}
