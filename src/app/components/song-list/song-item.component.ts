import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';
import { SubmissionService } from '../../services/submission.service';
import { SubmissionModalComponent } from '../submission-modal/submission-modal.component';
import { Submission } from '../../models/submission.interface';
import { SubmissionEditModalComponent } from '../submission-modal/submission-edit-modal.component';
import { AuthService } from '../../services/auth.service';
import { SongSyncService } from '../../services/song-sync.service';
import { ModalService } from '../../services/modal.service';
import { SongService } from '../../services/song.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-song-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      [class.no-video]="!hasSubmissions && !submissionPending"
      [class.pending-video]="submissionPending"
      [class.has-aaaa]="hasAAAASubmission && !isExpanded">
      <div class="shimmer-overlay"></div>
      <div class="corner-mark" 
        [class.completed]="hasSubmissions"
        [class.pending]="submissionPending">
        <i class="fas" [class.fa-check]="hasSubmissions" [class.fa-clock]="submissionPending"></i>
      </div>
      <div class="first-mark" *ngIf="showFirstIndicator && isFirstSubmission">
        <span>1st</span>
      </div>
      <div class="aaaa-mark" 
        *ngIf="hasAAAASubmission"
        (click)="showTooltip = !showTooltip"
        (mouseleave)="showTooltip = false"
        title="AAAA">
        <i class="fas fa-star"></i>
        <span class="tooltip-text" *ngIf="showTooltip">AAAA</span>
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
                Stepped by: {{song.stepArtist}}
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
            <div class="scroll-controls">
              <button 
                *ngIf="isLoggedIn$ | async"
                class="add-submission-btn"
                (click)="showSubmissionModal($event)"
                title="Add New Submission">
                <i class="fas fa-plus"></i>
              </button>
              <button 
                *ngIf="canScrollLeft"
                class="scroll-btn"
                (click)="scrollLeft()">
                <i class="fas fa-chevron-left"></i>
              </button>
            </div>

            <div class="submissions-container" 
              #submissionsContainer
              (scroll)="checkScrollButtons()"
              (touchstart)="touchStart($event)"
              (touchmove)="touchMove($event)"
              (touchend)="touchEnd()">
              <div class="submissions-wrapper">
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
            </div>

            <div class="scroll-controls">
              <button 
                *ngIf="canScrollRight"
                class="scroll-btn"
                (click)="scrollRight()">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div class="video-controls-right">
            <label 
              class="pending-toggle"
              *ngIf="(isLoggedIn$ | async) && !hasSubmissions"
              [title]="submissionPending ? 'Remove pending status' : 'Mark as pending'">
              <input
                type="checkbox"
                [checked]="submissionPending"
                (change)="togglePending($event)"
              />
              <span class="toggle-slider">
                <i class="fas fa-clock"></i>
              </span>
            </label>
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
              <img src="assets/icons/FFR_Guy_Small.png" class="ffr-btn" />
            </button>
          </div>
        </div>
        <div class="video-container" *ngIf="hasSubmissions && currentSubmission?.url; else noVideo">
          <iframe
            [src]="getSafeUrl(currentSubmission.url)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <ng-template #noVideo>
          <div class="missing-video" *ngIf="!submissionPending">
            <img 
              src="https://placehold.co/600x50/transparent/Ff0000?text=No%20Submissions"
              alt="No Submissions"
            />
          </div>
          <div class="missing-video" *ngIf="submissionPending">
            <img 
              src="https://placehold.co/600x50/transparent/428bca?text=Submission%20Pending"
              alt="Submission Pending"
            />
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .song-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
    }

    .tooltip-wrapper {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }
    
    .tooltip-text {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      white-space: nowrap;
      font-size: 0.75rem;
      z-index: 10;
    }

    .shimmer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 215, 0, 0.2) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      filter: blur(1.5px);
      transform: translateX(-100%) skewX(-20deg);
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: screen;
      opacity: 0;
    }
    
    .has-aaaa .shimmer-overlay {
      animation: shimmer 5s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes shimmer {
      0% {
        transform: translateX(-100%) skewX(-20deg);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      50% {
        transform: translateX(100%) skewX(-20deg);
        opacity: 1;
      }
      51% {
        opacity: 0;
      }
      100% {
        transform: translateX(100%) skewX(-20deg);
        opacity: 0;
      }
    }

    .song-item.has-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(144, 238, 144, 0.3) 100%
      );
    }

    .song-item.pending-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(66, 139, 202, 0.3) 100%
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

    :host-context(body.dark-mode) .song-item.pending-video {
      background: linear-gradient(135deg, 
        #2d2d2d 0%, 
        #2d2d2d 60%, 
        rgba(66, 139, 202, 0.15) 100%
      );
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
      z-index: 2;
    }

    .corner-mark.completed {
      border-color: #48bb78 transparent transparent transparent;
    }

    .corner-mark.pending {
      border-color: #428bca transparent transparent transparent;
    }

    :host-context(body.dark-mode) .corner-mark {
      border-color: #404040 transparent transparent transparent;
    }

    :host-context(body.dark-mode) .corner-mark.completed {
      border-color: #48bb78 transparent transparent transparent;
    }

    :host-context(body.dark-mode) .corner-mark.pending {
      border-color: #428bca transparent transparent transparent;
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

    .corner-mark.pending i {
      opacity: 1;
      top: -1.7rem;
      left: 0.2rem;
      font-size: 0.8rem;
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
      z-index: 2;
    }

    .first-mark span {
      position: absolute;
      top: 0.05rem;
      right: -1.8rem;
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .aaaa-mark {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 2rem 2rem 0;
      border-color: transparent #ffd700 transparent transparent;
      z-index: 2;
      opacity: 0.9;
    }

    .aaaa-mark i {
      position: absolute;
      top: 0.2rem;
      right: -1.9rem;
      color: #856404;
      font-size: 0.9rem;
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
      background: #f5f5f5;
      align-items: center;
      min-height: 46px;
    }

    :host-context(body.dark-mode) .video-controls {
      background: #222;
    }

    .video-controls-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    .add-submission-wrapper {
      flex-shrink: 0;
    }

    .scroll-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .scroll-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: #28aad1;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .scroll-btn:hover {
      background: #2391b2;
    }

    .submissions-container {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: relative;
      flex: 1;
      min-width: 0;
    }

    .submissions-container::-webkit-scrollbar {
      display: none;
    }

    .submissions-wrapper {
      display: flex;
      gap: 8px;
      padding: 4px 0;
    }

    .video-controls-right {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
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

    .pending-toggle {
      position: relative;
      display: inline-block;
      width: 28px;
      height: 24px;
      margin: 0;
    }

    .pending-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-slider i {
      color: #666;
      font-size: 0.9rem;
      transition: .4s;
    }

    .pending-toggle input:checked + .toggle-slider {
      background-color: #428bca;
    }

    .pending-toggle input:checked + .toggle-slider i {
      color: white;
    }

    :host-context(body.dark-mode) .toggle-slider {
      background-color: #444;
    }

    :host-context(body.dark-mode) .toggle-slider i {
      color: #999;
    }

    :host-context(body.dark-mode) .pending-toggle input:checked + .toggle-slider {
      background-color: #428bca;
    }

    :host-context(body.dark-mode) .pending-toggle input:checked + .toggle-slider i {
      color: white;
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
  `]
})
export class SongItemComponent {
  @Input() song!: SongWithSubmissions;
  @Input() showFirstIndicator: boolean = false;
  @Input() set isExpanded(value: boolean) {
    if (value !== this._isExpanded) {
      this._isExpanded = value;
      if (value) {
        setTimeout(() => this.checkScrollButtons(), 0);
      }
    }
  }
  @Output() expandToggle = new EventEmitter<void>();
  @ViewChild('submissionsContainer') submissionsContainer!: ElementRef;
  
  private _isExpanded: boolean = false;
  showTooltip: boolean = false;
  
  get isExpanded(): boolean {
    return this._isExpanded;
  }

  get submissionPending(): boolean {
    return !this.hasSubmissions && this.song.subPending;
  }

  get hasAAAASubmission(): boolean {
    return this.song.submissions.some(sub => sub.isAAAA);
  }

  canScrollLeft = false;
  canScrollRight = false;
  touchStartX = 0;
  touchScrollLeft = 0;

  currentSubmissionIndex: number = 0;
  selectedSubmissionIndex: number = -1;
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private sanitizer: DomSanitizer,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private songSyncService: SongSyncService,
    private modalService: ModalService,
    private songService: SongService,
    private popup: PopupService
  ) {}

  checkScrollButtons() {
    if (!this._isExpanded || !this.submissionsContainer) return;
    
    const container = this.submissionsContainer.nativeElement;
    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 1);
  }

  scrollLeft() {
    if (!this.submissionsContainer) return;
    const container = this.submissionsContainer.nativeElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    if (!this.submissionsContainer) return;
    const container = this.submissionsContainer.nativeElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  touchStart(e: TouchEvent) {
    if (!this.submissionsContainer) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchScrollLeft = this.submissionsContainer.nativeElement.scrollLeft;
  }

  touchMove(e: TouchEvent) {
    if (!this.submissionsContainer) return;
    const deltaX = this.touchStartX - e.touches[0].clientX;
    this.submissionsContainer.nativeElement.scrollLeft = this.touchScrollLeft + deltaX;
  }

  touchEnd() {
    this.checkScrollButtons();
  }

  get isFirstSubmission(): boolean {
    return this.song.submissions.some(sub => sub.firstSub);
  }

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

  async togglePending(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    try {
      await this.songService.updateSongPending(this.song.id, checkbox.checked);
      this.popup.show('Song updated successfully', 'success');
    } catch (error) {
      checkbox.checked = !checkbox.checked; // Revert the checkbox
      this.popup.show('Failed to update song', 'error');
    }
  }

  showSubmissionModal(event: Event) {
    event.stopPropagation();
    const modalRef = this.modalService.open<SubmissionModalComponent>(SubmissionModalComponent, {
      song: this.song,
      cancel: new EventEmitter<void>(),
      submit: new EventEmitter<Submission>()
    });

    modalRef.instance.cancel.subscribe(() => {
      this.modalService.closeModal();
    });

    modalRef.instance.submit.subscribe(async (submission: Submission) => {
      await this.handleSubmissionAdd(submission);
      this.modalService.closeModal();
    });
  }

  showSubmissionEditModal(event: Event, submissionIndex: number) {
    event.stopPropagation();
    this.selectedSubmissionIndex = submissionIndex;

    const modalRef = this.modalService.open<SubmissionEditModalComponent>(SubmissionEditModalComponent, {
      song: this.song,
      submissionIndex: this.selectedSubmissionIndex,
      cancel: new EventEmitter<void>(),
      delete: new EventEmitter<void>(),
      submit: new EventEmitter<Submission>()
    });

    modalRef.instance.cancel.subscribe(() => {
      this.modalService.closeModal();
    });

    modalRef.instance.delete.subscribe(async () => {
      await this.handleSubmissionDelete();
      this.modalService.closeModal();
    });

    modalRef.instance.submit.subscribe(async (submission: Submission) => {
      await this.handleSubmissionEdit(submission);
      this.modalService.closeModal();
    });
  }

  async resyncSongDetails(event: Event) {
    event.stopPropagation();
    try {
      await this.songSyncService.resyncSong(this.song.id);
    } catch (error) {
      console.error('Error resyncing song:', error);
    }
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
    } catch (error) {
      console.error('Error adding submission:', error);
    }
  }

  async handleSubmissionEdit(submissionData: Submission) {
    try {
      await this.submissionService.updateSubmission(submissionData);
      this.song.submissions[this.selectedSubmissionIndex] = submissionData;
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  }

  async handleSubmissionDelete() {
    try {
      const submission = this.song.submissions[this.selectedSubmissionIndex];
      await this.submissionService.deleteSubmission(submission);
      this.song.submissions = this.song.submissions.filter((_, index) => index !== this.selectedSubmissionIndex);
      this.currentSubmissionIndex = Math.min(this.currentSubmissionIndex, this.song.submissions.length - 1);
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