import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiUpdateGroup } from '../../models/wiki-update-group.interface';

@Component({
  selector: 'app-wiki-text-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Wiki Text</h3>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>
        
        <div class="form-group">
          <div class="copy-field">
            <textarea
              [value]="getWikiText()"
              readonly
              #textInput
              class="form-control"
              rows="8"
            ></textarea>
            <button class="copy-btn" (click)="copyText(textInput)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1100;
    }

    .modal-content {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    :host-context(body.dark-mode) .modal-content {
      background: #2d2d2d;
      color: #e0e0e0;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    :host-context(body.dark-mode) .modal-header h3 {
      color: #e0e0e0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    :host-context(body.dark-mode) .close-btn {
      color: #999;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .copy-field {
      position: relative;
      display: flex;
      gap: 0.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      font-family: monospace;
      resize: vertical;
      min-height: 150px;
    }

    :host-context(body.dark-mode) .form-control {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .copy-btn {
      padding: 0.5rem;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      color: #666;
    }

    :host-context(body.dark-mode) .copy-btn {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .copy-btn:hover {
      background: #e0e0e0;
    }

    :host-context(body.dark-mode) .copy-btn:hover {
      background: #444;
    }
  `]
})
export class WikiTextModalComponent {
  @Input() isUserWiki!: boolean;
  @Input() group!: WikiUpdateGroup;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getWikiText(): string {
    if (this.isUserWiki) {
      var txt = `==[[FFR Perfect Project]] Contributions==
<div style="{{Columns|2}}">`;
      this.group.items.forEach(v => txt += `\n*[[${v.title}]]`);
      txt += "\n</div>";
      return txt;
    } else {
      var txt = `==AAA playthrough==
<gallery mode="packed" hideaddbutton="true">`;
      this.group.items.forEach(v =>
        txt += `\nFile:${this.group.key} AAA (${v.title}) - FFR Perfect Project|AAA by [[${v.title}]]`
      );
      txt += "\n</gallery>";
      return txt;
    }
  }
  

  copyText(element: HTMLTextAreaElement) {
    element.select();
    document.execCommand('copy');
    element.setSelectionRange(0, 0); // Remove selection
  }
}