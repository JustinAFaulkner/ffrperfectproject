import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsService, ProjectStats } from '../../services/stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="stats-container" *ngIf="stats$ | async as stats">
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
          <img src="assets/icons/4u.png" alt="Arrows" />
          <div class="stat-content">
            <span class="stat-value">{{stats.totalArrows | number}}</span>
            <span class="stat-label">Total Notes</span>
          </div>
        </div>

        <a routerLink="/stats" class="stat-item view-all">
          <i class="fas fa-chart-line"></i>
          <div class="stat-content">
            <span class="view-all-text">View all stats</span>
            <i class="fas fa-arrow-right arrow-icon"></i>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      background: white;
      border-radius: 12px;
      padding: 0.2rem;
      height: 100%;
      overflow-y: auto;
      position: sticky;
      top: 20px;
    }

    :host-context(body.dark-mode) .stats-container {
      background: #141414;
    }

    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: all 0.2s;
      text-decoration: none;
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

    .stat-item img {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(40, 170, 209, 0.1);
      color: #28aad1;
      padding: 7px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    .view-all {
      cursor: pointer;
    }

    .view-all:hover {
      background: #28aad1;
    }

    :host-context(body.dark-mode) .view-all:hover {
      background: #28aad1;
    }

    .view-all:hover i,
    .view-all:hover .view-all-text,
    .view-all:hover .arrow-icon {
      color: white;
    }

    .view-all:hover i {
      background: rgba(255, 255, 255, 0.2);
    }

    .view-all .stat-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex: 1;
    }

    .view-all-text {
      font-size: 1rem;
      font-weight: 500;
      color: #333;
    }

    :host-context(body.dark-mode) .view-all-text {
      color: #e0e0e0;
    }

    .arrow-icon {
      color: #28aad1;
      font-size: 1.2rem;
      transition: transform 0.2s;
    }

    .view-all:hover .arrow-icon {
      transform: translateX(4px);
    }

    @media (max-width: 1024px) {
      .stats-container {
        height: auto;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-item {
        min-height: 50px;
      }

      .stat-value {
        font-size: 1rem;
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