import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div class="stat-card submissions">
        <i class="fas fa-file-arrow-up"></i>
        <div class="stat-info">
          <span class="stat-value">{{submissionCount}}</span>
          <span class="stat-label">Submissions</span>
        </div>
      </div>

      <div class="stat-card firsts">
        <i class="fas fa-ranking-star"></i>
        <div class="stat-info">
          <span class="stat-value">{{firstSubmissionCount}}</span>
          <span class="stat-label">First Submissions</span>
        </div>
      </div>

      <div class="stat-card achievements">
        <i class="fas fa-award"></i>
        <div class="stat-info">
          <span class="stat-value">{{completedAchievements}} / {{totalAchievements}}</span>
          <span class="stat-label">Achievements</span>
          <span class="secret-count" *ngIf="secretAchievements > 0">
            ({{secretAchievements}} secret)
          </span>
        </div>
      </div>

      <div class="stat-card difficulty">
        <i class="fas fa-chart-line"></i>
        <div class="stat-info">
          <div class="difficulty-stats">
            <div class="diff-item">
              <span class="diff-value">{{highestDifficulty}}</span>
              <span class="diff-label">Highest</span>
            </div>
            <div class="diff-item">
              <span class="diff-value">{{avgDifficulty | number:'1.0-0'}}</span>
              <span class="diff-label">Average</span>
            </div>
            <div class="diff-item">
              <span class="diff-value">{{lowestDifficulty}}</span>
              <span class="diff-label">Lowest</span>
            </div>
          </div>
          <span class="stat-label">Difficulty Range</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }

    :host-context(body.dark-mode) .stat-card {
      background: #2d2d2d;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card i {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .submissions i {
      background: #ebf8ff;
      color: #28aad1;
    }

    .firsts i {
      background: #fef3c7;
      color: #d97706;
    }

    .achievements i {
      background: #dcfce7;
      color: #22c55e;
    }

    .difficulty i {
      background: #fae8ff;
      color: #c026d3;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      line-height: 1.2;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    .secret-count {
      font-size: 0.8rem;
      color: #666;
      margin-left: 0.25rem;
    }

    :host-context(body.dark-mode) .secret-count {
      color: #999;
    }

    .difficulty-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.25rem;
    }

    .diff-item {
      text-align: center;
    }

    .diff-value {
      display: block;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    :host-context(body.dark-mode) .diff-value {
      color: #e0e0e0;
    }

    .diff-label {
      font-size: 0.8rem;
      color: #666;
    }

    :host-context(body.dark-mode) .diff-label {
      color: #999;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsCardsComponent {
  @Input() submissionCount!: number;
  @Input() firstSubmissionCount!: number;
  @Input() completedAchievements!: number;
  @Input() totalAchievements!: number;
  @Input() secretAchievements!: number;
  @Input() highestDifficulty!: number;
  @Input() avgDifficulty!: number;
  @Input() lowestDifficulty!: number;
}