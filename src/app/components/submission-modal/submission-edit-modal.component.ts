import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Submission } from '../../models/submission.interface';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';
import { YoutubeInfoModalComponent } from '../shared/youtube-info-modal.component';
import { ConfirmModalComponent } from '../shared/confirm-modal.component';
import { UrlTransformerService } from '../../services/url-transformer.service';

@Component({
  selector: 'app-submission-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, YoutubeInfoModalComponent, ConfirmModalComponent],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>Edit Submission</h2>
        <h3>{{ song.title }}</h3>
        <hr class="edit-hr"/>
        <div class="form-group">
          <label for="url">YouTube URL</label>
          <input
            type="url"
            id="url"
            [(ngModel)]="submission.url"
            class="form-control"
            value="{{ song.submissions[submissionIndex].url }}"
          />
        </div>

        <div class="form-group">
          <label for="contributor">Contributor</label>
          <input
            type="text"
            id="contributor"
            [(ngModel)]="submission.contributor"
            class="form-control"
            placeholder="FFR Username"
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

          <label>
            <input
              type="checkbox"
              [(ngModel)]="submission.firstSub"
            />
            First Submission
          </label>
        </div>

        <div class="button-group">
          <button class="btn-delete" (click)="showDeleteConfirm = true">
            <i class="fa fa-trash trash-icon"></i>
            Delete
          </button>
          <div class="button-group-right">
            <button class="btn-yt-info" (click)="showYtInfo = true">
              <i class="fab fa-youtube"></i>
              YT Info
            </button>
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
    </div>

    <app-youtube-info-modal
      *ngIf="showYtInfo"
      [song]="song"
      [contributor]="submission.contributor"
      (close)="showYtInfo = false">
    </app-youtube-info-modal>

    <app-confirm-modal
      *ngIf="showDeleteConfirm"
      title="Delete Submission"
      message="Are you sure you want to delete this submission? This action cannot be undone."
      confirmText="Delete"
      (confirm)="onConfirmDelete()"
      (cancel)="showDeleteConfirm = false">
    </app-confirm-modal>
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

    :host-context(body.dark-mode) .modal-content {
      background: #2d2d2d;
      color: #e0e0e0;
    }

    h2 {
      margin: 0 0 1.5rem;
      color: #333;
    }

    :host-context(body.dark-mode) h2,
    :host-context(body.dark-mode) h3 {
      color: #e0e0e0;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    :host-context(body.dark-mode) label {
      color: #999;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    :host-context(body.dark-mode) .form-control {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
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
      justify-content: space-between;
      margin-top: 1.5rem;
    }

    .button-group-right {
      display: flex;
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

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    .btn-submit {
      background: #28aad1;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #2391b2;
    }

    .edit-hr {
      margin-bottom: 8px;
    }

    .btn-delete {
      display: flex;
      gap: 6px;
      background: #fff184;
      align-items: center;
      justify-content: space-between;
      color: #866611;
      border: 1px solid #cc9b1a;
    }

    .btn-delete:hover {
      background: #ffc5ce;
      color: #8a0015;
      border: 1px solid #8a0015;
    }

    .trash-icon {
      font-size: 14px;
    }

    .btn-yt-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #ff0000;
      color: white;
    }

    .btn-yt-info:hover {
      background: #cc0000;
    }
  `]
})
export class SubmissionEditModalComponent {
  @Input() song!: SongWithSubmissions;
  @Input() submissionIndex!: number;

  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Submission>();

  private urlTransformer: UrlTransformerService = new UrlTransformerService;

  showYtInfo = false;
  showDeleteConfirm = false;

  submission: Submission = {
    id: '',
    songId: 0,
    url: '',
    contributor: '',
    songWikiUpdated: false,
    userWikiUpdated: false,
    firstSub: false
  };

  ngOnInit(): void {
    if (this.song && this.submissionIndex != null) {
      const currentSubmission = this.song.submissions[this.submissionIndex];
      if (currentSubmission) {
        this.submission = {
          id: currentSubmission.id,
          songId: Number(this.song.id),
          url: currentSubmission.url,
          contributor: currentSubmission.contributor,
          songWikiUpdated: currentSubmission.songWikiUpdated,
          userWikiUpdated: currentSubmission.userWikiUpdated,
          firstSub: currentSubmission.firstSub
        };
      }
    }
  }

  get isValid(): boolean {
    return (
      (this.submission.url.includes('/watch?v=') ||
        this.submission.url.includes('/embed/')) &&
      this.submission.contributor.trim() !== ''
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirmDelete(): void {
    this.showDeleteConfirm = false;
    this.delete.emit();
  }

  onSubmit(): void {
    if (this.isValid) {
      if (this.submission.url.includes('/watch?v=')) {
        this.submission.url = this.urlTransformer.transformYoutubeUrl(this.submission.url as string);
      }

      this.submit.emit({ ...this.submission });
    }
  }
}