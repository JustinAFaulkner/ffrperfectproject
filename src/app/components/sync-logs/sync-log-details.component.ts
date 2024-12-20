import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SyncLogService } from '../../services/sync-log.service';
import { SyncLogDetails } from '../../models/sync-log-details.interface';
import { AccessDeniedComponent } from '../shared/access-denied.component';
import { AuthService } from '../../services/auth.service';
import { LoggingService } from '../../services/logging.service';

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
            <h3>{{ change.currentTitle }} ({{ change.id }})</h3>
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

    .changes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .change-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .change-item {
      background: #2d2d2d;
    }

    h3 {
      margin: 0 0 0.5rem;
      color: #28aad1;
      font-size: 1.1rem;
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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private syncLogService: SyncLogService,
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
  }
}