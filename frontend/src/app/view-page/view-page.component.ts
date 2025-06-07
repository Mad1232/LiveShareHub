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
      const filesUrl = `http://localhost:5098/api/room/${this.roomId}/files`;
      this.http.get<SharedFile[]>(filesUrl).subscribe({
        next: files => this.filesList = files,
        error: err => console.error('Error fetching files', err)
      });
    }
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'assets/icons/image-icon.png';
      case 'pdf':
        return 'assets/icons/pdf-icon.png';
      case 'doc':
      case 'docx':
        return 'assets/icons/doc-icon.png';
      case 'zip':
      case 'rar':
        return 'assets/icons/zip-icon.png';
      case 'txt':
        return 'assets/icons/txt-icon.png';
      default:
        return 'assets/icons/file-icon.png';
    }
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadFile(file: SharedFile): void {
    const downloadUrl = `http://localhost:5098/api/room/${this.roomId}/files/${file.storedFileName}`;
    window.open(downloadUrl, '_blank');
  }

  goBackToRoom(): void {
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
