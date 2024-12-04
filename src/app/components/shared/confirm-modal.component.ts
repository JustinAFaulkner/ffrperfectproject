import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        <p class="message">{{ message }}</p>
        <div class="button-group">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-confirm" (click)="onConfirm()">{{ confirmText }}</button>
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
      z-index: 1200;
    }

    .modal-content {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
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
      margin-bottom: 1rem;
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

    .message {
      margin-bottom: 1.5rem;
      color: #666;
    }

    :host-context(body.dark-mode) .message {
      color: #999;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-cancel {
      background: #f0f0f0;
      color: #666;
    }

    :host-context(body.dark-mode) .btn-cancel {
      background: #333;
      color: #e0e0e0;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    :host-context(body.dark-mode) .btn-cancel:hover {
      background: #444;
    }

    .btn-confirm {
      background: #dc3545;
      color: white;
    }

    .btn-confirm:hover {
      background: #c82333;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}