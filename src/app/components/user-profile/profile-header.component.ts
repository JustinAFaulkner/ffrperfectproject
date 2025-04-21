import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-header">
      <div class="back-nav">
        <a routerLink="/leaderboard" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Back to Leaderboard
        </a>
      </div>
      
      <div class="header-content">
        <div class="user-info">
          <h1 class="username">{{username}}</h1>
          <div class="rank-badges">
            <div class="rank-badge" [class]="getRankClass(rank)">
              <i class="fas fa-file-arrow-up"></i>
              <span class="rank-label">Rank</span>
              <span class="rank-value">#{{rank}}</span>
            </div>
            <div class="rank-badge" [class]="getRankClass(firstRank)">
              <i class="fas fa-ranking-star"></i>
              <span class="rank-label">Firsts</span>
              <span class="rank-value">#{{firstRank}}</span>
            </div>
            <div 
              class="rank-badge clickable" 
              [class]="getRankClass(achievementRank)"
              (click)="onAchievementsClick()">
              <i class="fas fa-award"></i>
              <span class="rank-label">Achievements</span>
              <span class="rank-value">#{{achievementRank}}</span>
            </div>
            <div *ngIf="completedAchievements" class="rank-badge achievements-complete">
              <i class="fas fa-flag-checkered"></i>
              <span class="rank-label">Achievements</span>
              <span class="rank-label">Completed</span>
            </div>
          </div>
        </div>

        <a [href]="'https://www.flashflashrevolution.com/profile/' + username"
           target="_blank"
           class="ffr-profile-btn">
          <img src="assets/icons/FFR_Guy_Small.png" alt="FFR" class="ffr-icon" />
          View FFR Profile
        </a>
      </div>
    </div>
  `,
  styles: [`
    .profile-header {
      background: linear-gradient(135deg, #28aad1 0%, #1a7a9c 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .back-nav {
      margin-bottom: 1rem;
    }

    .back-link {
      color: white;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
      transition: all 0.2s;
    }

    .back-link:hover {
      opacity: 1;
      transform: translateX(-5px);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .username {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .rank-badges {
      display: flex;
      gap: 1rem;
    }

    .rank-badge {
      background: rgba(255,255,255,0.1);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      min-width: 100px;
      backdrop-filter: blur(4px);
      transition: transform 0.2s;
    }

    .rank-badge.clickable {
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .rank-badge.clickable::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.1);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .rank-badge.clickable:hover {
      transform: translateY(-2px);
    }

    .rank-badge.clickable:hover::after {
      opacity: 1;
    }

    .rank-badge i {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .achievements-complete {
      background: linear-gradient(135deg,rgb(50, 216, 0) 0%,rgb(5, 131, 22) 100%);
      color: #333;
    }

    .rank-label {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .rank-value {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .rank-badge.gold {
      background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
      color: #856404;
    }

    .rank-badge.silver {
      background: linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%);
      color: #666;
    }

    .rank-badge.bronze {
      background: linear-gradient(135deg, #cd7f32 0%, #dda15e 100%);
      color: #7c4a03;
    }

    .ffr-profile-btn {
      background: rgba(255,255,255,0.15);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      backdrop-filter: blur(4px);
    }

    .ffr-profile-btn:hover {
      background: #28aad1;
      transform: translateY(-2px);
    }

    .ffr-icon {
      height: 24px;
      width: auto;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .rank-badges {
        flex-wrap: wrap;
      }

      .rank-badge {
        flex: 1;
        min-width: 80px;
      }

      .ffr-profile-btn {
        align-self: stretch;
        justify-content: center;
      }
    }
  `]
})
export class ProfileHeaderComponent {
  @Input() username!: string;
  @Input() rank!: number;
  @Input() firstRank!: number;
  @Input() achievementRank!: number;
  @Input() completedAchievements!: boolean;
  @Output() achievementsClick = new EventEmitter<void>();

  getRankClass(rank: number): string {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  }

  onAchievementsClick() {
    this.achievementsClick.emit();
  }
}