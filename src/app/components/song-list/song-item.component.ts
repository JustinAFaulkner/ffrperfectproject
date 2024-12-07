import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';
import { SubmissionService } from '../../services/submission.service';
import { SubmissionModalComponent } from '../submission-modal/submission-modal.component';
import { Submission } from '../../models/submission.interface';
import { SubmissionEditModalComponent } from '../submission-modal/submission-edit-modal.component';
import { AuthService } from '../../services/auth.service';
import { SongSyncService } from '../../services/song-sync.service'

@Component({
  selector: 'app-song-item',
  standalone: true,
  imports: [
    CommonModule,
    SubmissionModalComponent,
    SubmissionEditModalComponent,
  ],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    <div 
      class="song-item"
      [class.has-video]="hasSubmissions"
      [class.no-video]="!hasSubmissions">
      <div class="corner-mark" [class.completed]="hasSubmissions">
        <i class="fas fa-check"></i>
      </div>
      <div class="first-mark" *ngIf="showFirstIndicator && isFirstSubmission">
        <span>1st</span>
      </div>
      <div class="song-header" (click)="toggleExpand()">
        <div class="song-diff">
          {{song.difficulty}}
        </div>
        <div class="song-info">
          <span class="song-title">{{song.title}}</span>
          <span class="song-subtitle">
            <span>{{ song.artist }}</span>
            <span *ngIf="!isExpanded">
                Stepped by: {{song.stepartist}}
            </span>
          </span>
        </div>
        <div *ngIf="!isExpanded" class="song-details">
          <span class="song-details-text">
            {{ song.seconds * 1000 | date:'mm:ss' }}
          </span>
          <span class="song-details-text">{{song.genre}}</span>
          <span class="song-details-text arrows-count">
            {{song.arrows}}
            <img src="assets/icons/4u.png" alt="Arrows" class="arrow-icon" />
          </span>
        </div>
      </div>
      
      <div class="song-content" *ngIf="isExpanded" [@expandCollapse]>
        <div class="video-controls">
          <div class="video-controls-left">
            <button 
              *ngIf="isLoggedIn$ | async"
              class="add-submission-btn"
              (click)="showSubmissionModal($event)"
              title="Add New Submission">
              <i class="fas fa-plus"></i>
            </button>
            <div 
              *ngFor="let submission of song.submissions; let i = index"
              class="submission-btn-group">
            <button
              (click)="setSubmission(i)"
              [class.active]="currentSubmissionIndex === i"
              [class.source-toggle-loggedin]="isLoggedIn$ | async"
              [class.source-toggle-btn]="!(isLoggedIn$ | async)">
              {{ submission.contributor }}
            </button>
            <button 
              *ngIf="isLoggedIn$ | async"
              class="edit-submission-btn"
              (click)="showSubmissionEditModal($event, i)"
              title="Edit Submission">
              <i class="fas fa-pencil-alt edit-btn"></i>
            </button>
            </div>
          </div>
          <div class="video-controls-right">
            <button 
              *ngIf="isLoggedIn$ | async"
              class="resync-song-btn"
              (click)="resyncSongDetails($event)"
              title="Re-Sync Song Info">
              <i class="fas fa-redo resync-btn"></i>
            </button>
            <button 
              class="ffr-song-btn"
              (click)="openUrl(song.id)"
              title="View FFR song page">
              <img 
                src="assets/icons/FFR_Guy_Small.png"
                class="ffr-btn"
              />
            </button>
          </div>    
        </div>
        <div class="video-container" *ngIf="currentSubmission?.youtubeUrl; else noVideo">
          <iframe
            [src]="getSafeUrl(currentSubmission.youtubeUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <ng-template #noVideo>
          <div class="missing-video">
            <img 
              src="https://placehold.co/600x400?text=Video+Not+Available"
              alt="Video not available"
            />
          </div>
        </ng-template>
      </div>
    </div>

    <app-submission-modal
      *ngIf="showModal"
      [song]="song"
      (cancel)="hideSubmissionModal()"
      (submit)="handleSubmissionAdd($event)">
    </app-submission-modal>

    <app-submission-edit-modal
      *ngIf="showEditModal"
      [song]="selectedSong"
      [submissionIndex]="selectedIndex"
      (delete)="handleSubmissionDelete()"
      (cancel)="hideSubmissionEditModal()"
      (submit)="handleSubmissionEdit($event)">
    </app-submission-edit-modal>
  `,
  styles: [
    `
    .song-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
    }

    .corner-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 2rem 2rem 0 0;
      border-color: #e2e8f0 transparent transparent transparent;
      transition: border-color 0.3s ease;
      z-index: 1;
    }

    .corner-mark.completed {
      border-color: #48bb78 transparent transparent transparent;
    }

    .corner-mark i {
      position: absolute;
      top: -1.8rem;
      left: 0.4rem;
      color: white;
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .corner-mark.completed i {
      opacity: 1;
    }

    .first-mark {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 2rem 2rem 0;
      border-color: transparent #28aad1 transparent transparent;
      z-index: 1;
    }

    .first-mark span {
      position: absolute;
      top: 0.05rem;
      right: -1.8rem;
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .song-item.has-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(144, 238, 144, 0.3) 100%
      );
    }

    .song-item.no-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(255, 99, 71, 0.2) 100%
      );
    }

    :host-context(body.dark-mode) .song-item {
      background: #2d2d2d;
    }

    :host-context(body.dark-mode) .song-item.has-video {
      background: linear-gradient(135deg, 
        #2d2d2d 0%, 
        #2d2d2d 60%, 
        rgba(144, 238, 144, 0.15) 100%
      );
    }

    :host-context(body.dark-mode) .song-item.no-video {
      background: linear-gradient(135deg, 
        #2d2d2d 0%, 
        #2d2d2d 60%, 
        rgba(255, 99, 71, 0.1) 100%
      );
    }

    :host-context(body.dark-mode) .corner-mark {
      border-color: #404040 transparent transparent transparent;
    }

    :host-context(body.dark-mode) .corner-mark.completed {
      border-color: #48bb78 transparent transparent transparent;
    }

    .song-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .song-diff {
      display: inline-block;
      padding: 0.5em 0.5em 0.5em 0;
      margin: auto 0.5em auto 0;
      border-right: 2px solid black;
      font-weight: bold;
    }

    :host-context(body.dark-mode) .song-diff {
      border-right-color: #666;
    }

    .song-header {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
      z-index: 1;
    }

    .song-header:hover {
      background-color: rgba(248, 248, 248, 0.7);
    }

    :host-context(body.dark-mode) .song-header:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .song-info {
      flex: 2;
      display: flex;
      flex-direction: column;
    }

    .song-title {
      font-weight: bold;
      color: #333;
    }

    .song-subtitle {
      color: #666;
      font-size: 0.9em;
      display: flex;
      flex-direction: column;
    }

    .song-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .song-details-text {
      color: #666;
      font-size: 0.9em;
    }

    .arrows-count {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .arrow-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }

    .song-content {
      border-top: 1px solid #eee;
      overflow: hidden;
    }

    .video-controls {
      display: flex;
      gap: 8px;
      padding: 8px;
      justify-content: space-between;
      background: #f5f5f5;
      align-items: center;
    }

    .video-controls-left {
      display: flex;
      gap: 8px;
      justify-content: flex-start;
      align-items: center;
    }

    .add-submission-btn {
      width: 28px;
      height: 24px;
      padding: 0;
      border: none;
      background: #4CAF50;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .add-submission-btn:hover {
      background: #45a049;
    }

    .submission-btn-group {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .source-toggle-btn {
      padding: 0 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s;
      height: 30px;
    }

    .source-toggle-loggedin {
      padding: 0 10px 0 12px;
      border-left: 1px solid #ddd;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-right: none;
      background: white;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s;
      height: 30px;
    }

    .source-toggle-btn.active {
      background: #28aad1;
      color: white;
    }

    .source-toggle-btn:hover:not(.active) {
      background: #f0f0f0;
    }

    .source-toggle-loggedin.active {
      background: #28aad1;
      color: white;
    }

    .source-toggle-loggedin:hover:not(.active) {
      background: #f0f0f0;
    }

    .edit-submission-btn {
      width: 24px;
      height: 30px;
      border: 1px solid #ddd;
      background: #b77bfa;
      color: white;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .edit-submission-btn:hover {
      background: #d6b4fc;
    }

    .edit-btn {
      font-size: 14px;
    }

    .video-controls-right {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .ffr-song-btn {
      width: 28px;
      height: 24px;
      padding: 0;
      border: none;
      background: #28aad1;
      color: white;
      border-radius: 20%;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .ffr-song-btn:hover {
      background: #28aad1;
    }

    .ffr-btn {
      width: auto;
      height: 17px;
    }

    .resync-song-btn {
      width: 28px;
      height: 24px;
      padding: 0;
      border: none;
      background: #b77bfa;
      color: white;
      border-radius: 20%;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .resync-song-btn:hover {
      background: #d6b4fc;
    }

    .resync-btn {
      font-size: 16px;
    }

    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }

    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .missing-video {
      padding: 20px;
      text-align: center;
    }

    .missing-video img {
      max-width: 100%;
      height: auto;
    }
  `,
  ],
})
export class SongItemComponent {
  @Input() song!: SongWithSubmissions;
  @Input() isExpanded: boolean = false;
  @Input() showFirstIndicator: boolean = false;
  @Output() expandToggle = new EventEmitter<void>();

  get isFirstSubmission(): boolean {
    return this.song.submissions.some(sub => sub.firstSub);
  }

  currentSubmissionIndex: number = 0;
  showModal: boolean = false;
  showEditModal: boolean = false;
  editSubmissionIndex: number = 0;
  selectedSong!: SongWithSubmissions;
  selectedIndex: number = 0;
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private sanitizer: DomSanitizer,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private songSyncService: SongSyncService
  ) {}

  get hasSubmissions(): boolean {
    return this.song.submissions.length > 0;
  }

  get currentSubmission() {
    return this.song.submissions[this.currentSubmissionIndex];
  }

  toggleExpand() {
    this.expandToggle.emit();
  }

  setSubmission(index: number) {
    this.currentSubmissionIndex = index;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  showSubmissionModal(event: Event) {
    event.stopPropagation();
    this.showModal = true;
  }

  showSubmissionEditModal(event: Event, submissionIndex: number) {
    event.stopPropagation();
    this.selectedSong = this.song;
    this.selectedIndex = submissionIndex;
    this.showEditModal = true;
  }

  async resyncSongDetails(event: Event) {
    event.stopPropagation();
    try {
      await this.songSyncService.resyncSong(this.song.id);
    } catch (error) {
      console.error('Error resyncing song:', error);
    }
  }

  hideSubmissionModal() {
    this.showModal = false;
  }

  hideSubmissionEditModal() {
    this.showEditModal = false;
  }

  async handleSubmissionAdd(submissionData: Omit<Submission, 'songId'>) {
    try {
      const newSubmission: Submission = {
        songId: Number(this.song.id),
        ...submissionData,
      };

      await this.submissionService.addSubmission(this.song.id, newSubmission);
      this.song.submissions = [...this.song.submissions, newSubmission];
      this.currentSubmissionIndex = this.song.submissions.length - 1;
      this.hideSubmissionModal();
    } catch (error) {
      console.error('Error adding submission:', error);
    }
  }

  async handleSubmissionEdit(submissionData: Submission) {
    try {
      await this.submissionService.updateSubmission(submissionData);
      this.song.submissions[this.selectedIndex] = submissionData;
      this.hideSubmissionEditModal();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  }

  async handleSubmissionDelete() {
    try {
      const submission = this.song.submissions[this.selectedIndex];
      await this.submissionService.deleteSubmission(submission);
      this.song.submissions.splice(this.selectedIndex, 1);
      this.currentSubmissionIndex = this.song.submissions.length - 1;
      this.hideSubmissionEditModal();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  }

  openUrl(songId: string): void {
    window.open(
      'https://www.flashflashrevolution.com/levelstats.php?level=' + songId,
      '_blank'
    );
  }
}