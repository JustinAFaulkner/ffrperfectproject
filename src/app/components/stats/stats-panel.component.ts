import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, ProjectStats } from '../../services/stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-panel" *ngIf="stats$ | async as stats">
      <div class="stats-grid">
        <div class="stat-item">
          <i class="fas fa-music"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.totalSongs | number}}</span>
            <span class="stat-label">Songs</span>
          </div>
        </div>
        
        <div class="stat-item">
          <i class="fas fa-circle-user"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.totalArtists | number}}</span>
            <span class="stat-label">Artists</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-file-arrow-up"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.totalSubmissions | number}}</span>
            <span class="stat-label">Submissions</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-arrow-up"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.totalArrows | number}}</span>
            <span class="stat-label">Total Notes</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-award"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.totalAchievements | number}}</span>
            <span class="stat-label">Achievements</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-star"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.level}}</span>
            <span class="stat-label">Level</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-users"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.subscribers | number}}</span>
            <span class="stat-label">Subscribers</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-eye"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.views | number}}</span>
            <span class="stat-label">Total Views</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-coins"></i>
          <div class="stat-content">
            <span class="stat-value">{{stats.credits | number}}</span>
            <span class="stat-label">Credits</span>
          </div>
        </div>

        <div class="stat-item">
          <i class="fas fa-calculator"></i>
          <div class="stat-content">
            <span class="stat-value total">{{stats.grandTotal | number}}</span>
            <span class="stat-label">Grand Total</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-panel {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .stats-panel {
      background: #2d2d2d;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    :host-context(body.dark-mode) .stat-item {
      background: #333;
    }

    .stat-item:hover {
      transform: translateY(-2px);
    }

    .stat-item i {
      font-size: 1.5rem;
      color: #28aad1;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(40, 170, 209, 0.1);
      border-radius: 8px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      line-height: 1.2;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .total {
      font-size: 1rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    @media (max-width: 768px) {
      .stats-panel {
        padding: 0.75rem;
        margin-bottom: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }

      .stat-item {
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .stat-item i {
        font-size: 1rem;
        width: 32px;
        height: 32px;
      }

      .stat-value {
        font-size: 1rem;
      }

      .stat-label {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-item {
        min-height: 70px;
      }
    }
  `]
})
export class StatsPanelComponent {
  stats$: Observable<ProjectStats>;

  constructor(private statsService: StatsService) {
    this.stats$ = this.statsService.getProjectStats();
  }
}