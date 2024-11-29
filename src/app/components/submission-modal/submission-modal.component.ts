import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Submission } from '../../models/submission.interface';

@Component({
  selector: 'app-submission-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>Add New Submission</h2>
        
        <div class="form-group">
          <label for="youtubeUrl">YouTube URL</label>
          <input
            type="url"
            id="youtubeUrl"
            [(ngModel)]="submission.youtubeUrl"
            class="form-control"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div class="form-group">
          <label for="contributor">Contributor</label>
          <input
            type="text"
            id="contributor"
            [(ngModel)]="submission.contributor"
            class="form-control"
            placeholder="Your name"
          />
        </div>

        <div class="checkbox-group">
          <label>
            <input
              type="checkbox"
              [(ngModel)]="submission.songWikiUpdated"
            />
            Song Wiki Updated
          </label>

          <label>
            <input
              type="checkbox"
              [(ngModel)]="submission.userWikiUpdated"
            />
            User Wiki Updated
          </label>
        </div>

        <div class="button-group">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button 
            class="btn-submit" 
            (click)="onSubmit()"
            [disabled]="!isValid"
          >
            Submit
          </button>
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
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin: 0 0 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .checkbox-group {
      margin: 1rem 0;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #f0f0f0;
      color: #666;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .btn-submit {
      background: #28aad1;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #2391b2;
    }
  `]
})
export class SubmissionModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Omit<Submission, 'songId'>>();

  submission: Omit<Submission, 'songId'> = {
    youtubeUrl: '',
    contributor: '',
    songWikiUpdated: false,
    userWikiUpdated: false
  };

  get isValid(): boolean {
    return (
      this.submission.youtubeUrl.trim() !== '' &&
      this.submission.contributor.trim() !== ''
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.isValid) {
      this.submit.emit({ ...this.submission });
    }
  }
}