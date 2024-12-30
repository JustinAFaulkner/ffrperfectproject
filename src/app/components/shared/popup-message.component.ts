import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="popup-overlay" @fadeInOut>
      <div class="popup-content" [class]="type">
        <div class="message">{{message}}</div>
        <button class="close-btn" (click)="onClose()">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1500;
    }

    .popup-content {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 90%;
      width: 400px;
      text-align: center;
    }

    :host-context(body.dark-mode) .popup-content {
      background: #2d2d2d;
      color: #e0e0e0;
    }

    .message {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .close-btn {
      padding: 0.5rem 2rem;
      background: #28aad1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background: #2391b2;
    }

    /* Message types */
    .success {
      border-top: 4px solid #48bb78;
    }

    .error {
      border-top: 4px solid #f56565;
    }

    .info {
      border-top: 4px solid #28aad1;
    }

    .warning {
      border-top: 4px solid #ed8936;
    }
  `]
})
export class PopupMessageComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() onClose: () => void = () => {};
}