import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SyncLogService } from '../../services/sync-log.service';
import { SyncLogDetails } from '../../models/sync-log-details.interface';
import { AccessDeniedComponent } from '../shared/access-denied.component';
import { AuthService } from '../../services/auth.service';
import { LoggingService } from '../../services/logging.service';
import { SongService } from '../../services/song.service';
import { FilterService } from '../../services/filter.service';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';
import { SongFilters, defaultFilters } from '../../models/song-filters.interface';

@Component({
  selector: 'app-sync-log-details',
  standalone: true,
  imports: [CommonModule, AccessDeniedComponent],
  template: `
    <ng-container *ngIf="isLoggedIn$ | async; else accessDenied">
      <div class="container" *ngIf="logDetails">
        <h1>Sync Change Log - {{ logDetails.timestamp | date:'medium' }}</h1>
        
        <div class="changes-list">
          <div *ngFor="let change of logDetails.changes" class="change-item">
            <div class="corner-mark" [class.completed]="hasSubmissions(change.id)">
              <i class="fas fa-check"></i>
            </div>
            <div class="change-header">
              <h3>{{ change.currentTitle }} ({{ change.id }})</h3>
            </div>
            <div class="changes">
              <div *ngIf="change.isNewSong" class="new-song">
                New song added
              </div>
              <ng-container *ngIf="!change.isNewSong">
                <div *ngFor="let fieldChange of change.changes" class="field-change">
                  <span class="field-name">{{ fieldChange.field }}:</span>
                  <span class="old-value">{{ fieldChange.oldValue }}</span>
                  <i class="fas fa-arrow-right"></i>
                  <span class="new-value">{{ fieldChange.newValue }}</span>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-template #accessDenied>
      <app-access-denied></app-access-denied>
    </ng-template>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    :host-context(body.dark-mode) h1 {
      color: #e0e0e0;
    }

    .corner-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-radius: 8px 0 0 0;
      border-width: 2rem 2rem 0 0;
      border-color: #e2e8f0 transparent transparent transparent;
      transition: border-color 0.3s ease;
      z-index: 1;
    }

    :host-context(body.dark-mode) .corner-mark {
      border-color: #333 transparent transparent transparent;
    }

    .corner-mark.completed {
      border-color: #48bb78 transparent transparent transparent;
    }

    :host-context(body.dark-mode) .corner-mark.completed {
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

    .changes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .change-item {
      background: white;
      padding: 1rem 1rem 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
    }

    :host-context(body.dark-mode) .change-item {
      background: #2d2d2d;
    }

    .change-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    h3 {
      margin: 0;
      color: #28aad1;
      font-size: 1.1rem;
    }

    .submission-status {
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: #dc3545;
      color: white;
    }

    .submission-status.has-submissions {
      background: #28a745;
    }

    .changes {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .new-song {
      color: #28a745;
      font-weight: 500;
    }

    .field-change {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .field-name {
      font-weight: 500;
      color: #666;
      min-width: 100px;
    }

    :host-context(body.dark-mode) .field-name {
      color: #999;
    }

    .old-value {
      color: #dc3545;
      text-decoration: line-through;
    }

    .new-value {
      color: #28a745;
    }

    :host-context(body.dark-mode) .old-value {
      color: #e57373;
    }

    :host-context(body.dark-mode) .new-value {
      color: #81c784;
    }

    .fa-arrow-right {
      color: #666;
      font-size: 0.8rem;
    }

    :host-context(body.dark-mode) .fa-arrow-right {
      color: #999;
    }
  `]
})
export class SyncLogDetailsComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn();
  logDetails: SyncLogDetails | null = null;
  songs: SongWithSubmissions[] = [];
  filters: SongFilters = { ...defaultFilters };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private syncLogService: SyncLogService,
    private songService: SongService,
    private filterService: FilterService,
    private logger: LoggingService
  ) {}

  ngOnInit() {
    this.logger.info('SyncLogDetailsComponent initialized');
    
    const filename = this.route.snapshot.paramMap.get('filename');
    if (!filename) {
      this.logger.error('No filename provided in route params');
      return;
    }

    this.logger.info('Loading sync log details', { filename });    

    this.syncLogService.getSyncLogDetails(filename).subscribe({
      next: (details) => {
        this.logger.info('Successfully loaded sync log details', {
          timestamp: details.timestamp,
          changeCount: details.changes.length
        });
        this.logDetails = details;
      },
      error: (error) => {
        this.logger.error('Error loading sync log details', error);
      }
    });

    this.filters.ids = this.logDetails?.changes.map(log => log.id);

    this.songService.getSongs().subscribe((songs) => {
      this.songs = this.filterService.filterSongs(songs, this.filters);
    })
  }

  hasSubmissions(songId: string): boolean {
    const song = this.songs.find(song => song.id == songId);
    if (song) return song.submissions.length > 0;

    return false;
  }
}