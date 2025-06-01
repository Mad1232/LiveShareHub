import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  createRoom(): void {
    console.log('Create Room button clicked!');
    // Add your logic for creating a room here (e.g., navigate to a new route, call an API, etc.)
  }
}