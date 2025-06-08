import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { HttpClient } from '@angular/common/http';
import { SharedFile } from '../models/shared-files';

import { SignalRService } from '../services/signalr.service';  // import SignalR service

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {
  roomId: string | null = null;
  filesList: SharedFile[] = [];

  @ViewChild('cmHost') cmHost!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private editorView!: EditorView;
  private suppressSignalRUpdate = false; // flag to prevent feedback loop

  currentCode: string = `// Welcome to Room! Start coding with CodeMirror 6!\n\nfunction greet() {\n  console.log("Hello!");\n}`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('id');
      this.currentCode = `// Welcome to Room: ${this.roomId}\n// Start coding with CodeMirror 6!\n\nfunction greet() {\n  console.log("Hello, ${this.roomId}!");\n}`;

      if (this.roomId) {
        this.signalRService.startConnection(this.roomId);

        // When SignalR receives code update from others, update editor
        this.signalRService.onCodeReceived((code: string) => {
          if (code !== this.getEditorCode()) {
            this.suppressSignalRUpdate = true; // prevent sending back this change
            this.setEditorCode(code);
            this.suppressSignalRUpdate = false;
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.cmHost && this.cmHost.nativeElement) {
      const state = EditorState.create({
        doc: this.currentCode,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          drawSelection(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          javascript(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              this.currentCode = update.state.doc.toString();

              // Only send updates if NOT caused by incoming SignalR update
              if (!this.suppressSignalRUpdate && this.roomId) {
                this.signalRService.sendCode(this.roomId, this.currentCode);
              }
            }
          })
        ]
      });

      this.editorView = new EditorView({
        state,
        parent: this.cmHost.nativeElement
      });
    } else {
      console.error("CodeMirror host element (#cmHost) not found in ngAfterViewInit.");
    }
  }

  ngOnDestroy(): void {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  getEditorCode(): string {
    return this.editorView ? this.editorView.state.doc.toString() : this.currentCode;
  }

  setEditorCode(newCode: string): void {
    if (this.editorView) {
      this.editorView.dispatch({
        changes: { from: 0, to: this.editorView.state.doc.length, insert: newCode }
      });
    } else {
      this.currentCode = newCode;
    }
  }

  exitRoom(): void {
    if (!this.roomId) {
      console.log("Wrong Room ID");
      return;
    }

    const deleteUrl = `http://18.191.119.189:5098/api/room/${this.roomId}`; // url changed
    this.http.delete(deleteUrl).subscribe({
      next: () => {
        console.log("Room deleted successfully");
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Failed to delete room", err);
        alert("Failed to delete room");
      }
    });
  }

  uploadFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = () => {
      if (!input.files || input.files.length === 0 || !this.roomId) return;

      const selectedFile = input.files[0];
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadUrl = `http://18.191.119.189/api/room/${this.roomId}/upload`; //url changed

      this.http.post(uploadUrl, formData).subscribe({
        next: (response) => {
          console.log("Upload successful", response);
          alert("File uploaded successfully!");
          this.viewFiles();
        },
        error: (error) => {
          console.error("Upload failed", error);
          alert("Failed to upload file.");
        }
      });
    };

    input.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0 || !this.roomId) return;

    const selectedFile = target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);

    const uploadUrl = `http://18.191.119.189/api/room/${this.roomId}/upload`; //url changed

    this.http.post(uploadUrl, formData).subscribe({
      next: (response) => {
        console.log("Upload successful", response);
        alert("File uploaded successfully!");
      },
      error: (error) => {
        console.error("Upload failed", error);
        alert("Failed to upload file.");
      }
    });
  }

  viewFiles(): void {
    if (!this.roomId) {
      alert('No Room ID found.');
      return;
    }
    this.router.navigate([`/room/${this.roomId}/view`]);

    const filesUrl = `http://18.191.119.189/api/room/${this.roomId}/files`; //url changed
    this.http.get<SharedFile[]>(filesUrl).subscribe({
      next: (files) => {
        this.filesList = files;
        console.log('Files in room:', files);
        alert('Files retrieved! Check console or UI for list.');
      },
      error: (err) => {
        console.error('Failed to fetch files', err);
        alert('No files were uploaded');
      }
    });
  }

  downloadFile(file: SharedFile) {
    const downloadUrl = `http://18.191.119.189:5098/api/room/${this.roomId}/files/${file.storedFileName}`; //url changed
    window.open(downloadUrl, '_blank'); 
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
}
