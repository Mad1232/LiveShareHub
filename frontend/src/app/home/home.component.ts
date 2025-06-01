import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  createRoom(): void {
    console.log('Create Room button clicked!');
    this.router.navigate(['/room']).then(success => {
      console.log('Navigation to /room succeeded:', success);
    }).catch(error => {
      console.error('Navigation to /room failed:', error);
    });
    
  }
}
