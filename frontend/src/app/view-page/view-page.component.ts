import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedFile } from '../models/shared-files';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  roomId: string | null = null;
  filesList: SharedFile[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (this.roomId) {
      const filesUrl = `http://18.191.119.189/api/room/${this.roomId}/files`; //url changed
      this.http.get<SharedFile[]>(filesUrl).subscribe({
        next: files => this.filesList = files,
        error: err => console.error('No files are uploaded', err)
      });
    }
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
        return 'assets/icons/folder.png';
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadFile(file: SharedFile): void {
    const downloadUrl = `http://18.191.119.189:5098/api/room/${this.roomId}/files/${file.storedFileName}`; //url changed
    window.open(downloadUrl, '_blank');
  }

  goBackToRoom(): void {
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
