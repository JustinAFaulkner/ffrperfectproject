import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStats } from '../../models/user-stats.interface';

@Component({
  selector: 'app-user-stats-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Total Submissions</span>
        <span class="stat-value">{{stats.submissionCount}}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">First Submissions</span>
        <span class="stat-value">{{stats.firstSubmissionCount}}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Highest Difficulty</span>
        <span class="stat-value">{{stats.highestDifficulty}}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Average Difficulty</span>
        <span class="stat-value">{{ stats.avgDifficulty | number: '1.0-0' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Lowest Difficulty</span>
        <span class="stat-value">{{stats.lowestDifficulty}}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Achievements</span>
        <span class="stat-value" [class.achievements-completed]="completedAchievements == totalAchievements">{{completedAchievements}} / {{totalAchievements}}</span>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      color: #666;
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    .stat-value {
      display: block;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .achievements-completed {
      color:rgb(88, 204, 78) !important;
    }
  `]
})
export class UserStatsGridComponent {
  @Input() stats!: UserStats;
  @Input() completedAchievements: number = 0;
  @Input() totalAchievements: number = 0;
}