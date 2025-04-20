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
        </div>
      </div>

      <div class="stat-card aaaa">
        <i class="fas fa-crosshairs"></i>
        <div class="stat-info">
          <span class="stat-value">{{aaaaSubmissionCount}}</span>
          <span class="stat-label">AAAAs</span>
        </div>
      </div>

      <div class="stat-card scroll-direction">
        <i class="fas fa-arrow-right-arrow-left fa-rotate-90"></i>
        <div class="stat-info">
          <div class="progress-bar-blue">
            <div 
              class="progress-red" 
              [style.width.%]="((submissionCount - downscrollSubmissionCount) / submissionCount) * 100">
            </div>
          </div>
          <div class="scroll-stats">
            <div class="color-key">
              <div class="dot-red"></div>
              Upscroll ({{ submissionCount - downscrollSubmissionCount }})
            </div>
            <div class="color-key">
              <div class="dot-blue"></div>
              Downscroll ({{ downscrollSubmissionCount }})
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card difficulty">
        <i class="fas fa-align-left fa-rotate-90"></i>
        <div class="stat-info">
          <span class="stat-value">{{highestDifficulty}}</span>
          <span class="stat-label">Highest Difficulty</span>
        </div>
      </div>

      <div class="stat-card difficulty">
        <i class="fas fa-align-center fa-rotate-90"></i>
        <div class="stat-info">
          <span class="stat-value">{{avgDifficulty | number:'1.0-0'}}</span>
          <span class="stat-label">Average Difficulty</span>
        </div>
      </div>

      <div class="stat-card difficulty">
        <i class="fas fa-align-right fa-rotate-90"></i>
        <div class="stat-info">
          <span class="stat-value">{{lowestDifficulty}}</span>
          <span class="stat-label">Lowest Difficulty</span>
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

    .aaaa i {
      background: #fef9c3;
      color: #ca8a04;
    }

    .scroll-direction i {
      background: #f3e8ff;
      color: #9333ea;
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

    .progress-bar-blue {
      width: 100%;
      height: 10px;
      background: #28aad1;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-red {
      height: 100%;
      background: #ff0040;
      transition: width 0.3s ease;
    }

    .scroll-stats {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #666;
    }

    :host-context(body.dark-mode) .scroll-stats {
      color: #999;
    }

    .color-key {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .dot-red {
      height: 8px;
      width: 8px;
      border-radius: 8px;
      background: #ff0040;
    }

    .dot-blue {
      height: 8px;
      width: 8px;
      border-radius: 8px;
      background: #28aad1;
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
  @Input() aaaaSubmissionCount!: number;
  @Input() downscrollSubmissionCount!: number;
}