import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {
  roomId: string | null = 'Loading...';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('id') || 'General Room';
    });
  }


  exitRoom(): void {
    console.log('Exit Room clicked!');
    this.router.navigate(['/']);
  }

  uploadFile(): void {
    console.log('Upload File clicked!');
  }

  viewFiles(): void {
    console.log('View Files clicked!');
  }

}