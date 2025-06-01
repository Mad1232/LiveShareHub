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
  private editorView!: EditorView;                         // To hold the CodeMirror instance
  currentCode: string = `// Welcome to Room:!\n// Start coding with CodeMirror 6!\n\nfunction greet() {\n  console.log("Hello, world!");\n}`;


  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
    console.log('Exit Room clicked!');
    this.router.navigate(['/']);
  }

  uploadFile(): void {
    console.log('Upload File clicked!');
    // Future: Implement file upload logic
  }

  viewFiles(): void {
    console.log('View Files clicked!');
    // Future: Implement logic to view files
  }
}