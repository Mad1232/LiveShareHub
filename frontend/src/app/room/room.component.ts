import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy { // Added AfterViewInit and OnDestroy
  roomId: string | null = 'Loading...';


  @ViewChild('cmHost') cmHost!: ElementRef<HTMLDivElement>; // For the editor's host div
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // for fileInput
  private editorView!: EditorView;                         // To hold the CodeMirror instance
  currentCode: string = `// Welcome to Room:!\n// Start coding with CodeMirror 6!\n\nfunction greet() {\n  console.log("Hello, world!");\n}`;


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    const roomId = this.route.snapshot.paramMap.get('id');
    console.log('Room ID from URL:', roomId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('id');
      this.currentCode = `// Welcome to Room! \n// Start coding with CodeMirror 6!\n\nfunction greet() {\n  console.log("Hello, ${this.roomId}!");\n}`;
    });
  }

  // CodeMirror 6 Lifecycle Hooks and Methods -
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
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab
          ]),

          javascript(), // Default language for now
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              this.currentCode = update.state.doc.toString();
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

  // helper methods to interact with the editor
  public getEditorCode(): string {
    return this.editorView ? this.editorView.state.doc.toString() : this.currentCode;
  }

  public setEditorCode(newCode: string): void {
    if (this.editorView) {
      this.editorView.dispatch({
        changes: { from: 0, to: this.editorView.state.doc.length, insert: newCode }
      });
    } else {
      // If editor not yet initialized, update the initial code
      this.currentCode = newCode;
    }
  }

  exitRoom(): void {
    if (!this.roomId || this.roomId == 'Loading...'){
      console.log("Wrong Room ID")
      return;
    }
  
    const deleteUrl = `http://localhost:5098/api/room/${this.roomId}`;
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
    console.log('Upload File clicked!');
    this.fileInput.nativeElement.click(); 
    // Future: Implement file upload logic
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0 || !this.roomId) return;

    const selectedFile = target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);

    const uploadUrl = `http://localhost:5098/api/room/${this.roomId}/upload`;

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
    console.log('View Files clicked!');
    // Future: Implement logic to view files
  }
}