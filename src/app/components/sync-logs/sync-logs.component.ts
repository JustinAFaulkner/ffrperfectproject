import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SyncLogService } from '../../services/sync-log.service';
import { SyncLog } from '../../models/sync-log.interface';
import { AccessDeniedComponent } from '../shared/access-denied.component';
import { AuthService } from '../../services/auth.service';
import { LoggingService } from '../../services/logging.service';

@Component({
  selector: 'app-sync-logs',
  standalone: true,
  imports: [CommonModule, AccessDeniedComponent],
  template: `
    <ng-container *ngIf="isLoggedIn$ | async; else accessDenied">
      <div class="container">
        <h1>Song Change Logs</h1>
        <div class="logs-list">
          <div 
            *ngFor="let log of logs$ | async" 
            class="log-item"
            (click)="viewLogDetails(log)">
            <span class="timestamp">
              {{ log.timestamp | date:'medium' }}
            </span>
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

    .logs-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .log-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }

    :host-context(body.dark-mode) .log-item {
      background: #2d2d2d;
    }

    .log-item:hover {
      transform: translateX(5px);
    }

    .timestamp {
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .timestamp {
      color: #999;
    }
  `]
})
export class SyncLogsComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn();
  logs$ = this.syncLogService.getSyncLogs();

  constructor(
    private router: Router,
    private authService: AuthService,
    private syncLogService: SyncLogService,
    private logger: LoggingService
  ) {}

  ngOnInit() {
    this.logger.info('SyncLogsComponent initialized');
    
    this.logs$.subscribe({
      next: (logs) => {
        this.logger.info('Received sync logs', { count: logs?.length });
      },
      error: (error) => {
        this.logger.error('Error loading sync logs', error);
      }
    });
  }

  viewLogDetails(log: SyncLog) {
    // Extract just the filename from the href
    const filename = log.filename.split('/').pop();
    if (filename) {
      this.router.navigate(['/sync-log', filename]);
    } else {
      this.logger.error('Invalid log filename', { filename: log.filename });
    }
  }
}