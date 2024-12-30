import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SongItemComponent } from '../song-list/song-item.component';
import { UserStatsService } from '../../services/user-stats.service';
import { AchievementService } from '../../services/achievement.service';
import { UserStatsGridComponent } from './user-stats-grid.component';
import { UserAchievementsComponent } from './user-achievements.component';
import { Observable, map, switchMap, tap } from 'rxjs';
import { UserStats } from '../../models/user-stats.interface';
import { UserAchievement } from '../../models/user-achievement.interface';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, 
    SongItemComponent, 
    UserStatsGridComponent,
    UserAchievementsComponent
  ],
  template: `
    <div class="profile-container" *ngIf="userStats$ | async as stats">
      <div class="profile-header">
        <div class="profile-info">
          <h1 class="username">{{stats.username}}</h1>
          <div class="rank-badges">
            <div class="rank-badge" [class]="getRankClass(stats.rank)">
              Rank #{{stats.rank}}
            </div>
            <div class="rank-badge firsts" [class]="getRankClass(stats.firstRank)">
              Firsts Rank #{{stats.firstRank}}
            </div>
          </div>
        </div>
        
        <app-user-stats-grid
          [stats]="stats"
          [completedAchievements]="getCompletedAchievements(achievements)"
          [totalAchievements]="totalAchievements">
        </app-user-stats-grid>

        <a 
          [href]="'https://www.flashflashrevolution.com/profile/' + stats.username"
          target="_blank"
          class="ffr-profile-btn">
          View FFR Profile
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>{{showAchievements ? 'Achievements' : 'Submissions'}}</h2>
          <button class="toggle-btn" (click)="showAchievements = !showAchievements">
            {{showAchievements ? 'Submissions' : 'Achievements'}}
          </button>
        </div>

        <ng-container *ngIf="showAchievements; else submissionsList">
          <app-user-achievements [achievements]="achievements"></app-user-achievements>
        </ng-container>

        <ng-template #submissionsList>
          <div class="submissions-list">
            <app-song-item
              *ngFor="let song of stats.songs"
              [song]="filterSubmissionsForUser(song, stats.username)"
              [isExpanded]="expandedSong === song.id"
              [showFirstIndicator]="true"
              (expandToggle)="toggleSong(song)">
            </app-song-item>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-header {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .profile-header {
      background: #2d2d2d;
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .username {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    :host-context(body.dark-mode) .username {
      color: #e0e0e0;
    }

    .rank-badges {
      display: flex;
      gap: 10px;
    }

    .rank-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .rank-badge.firsts {
      background: linear-gradient(135deg, #28aad1 0%, #3dbde4 100%);
      color: white;
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

    .rank-badge.default {
      background: #f0f0f0;
      color: #666;
    }

    .ffr-profile-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #28aad1;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .ffr-profile-btn:hover {
      background: #2391b2;
    }

    .content-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
    }

    :host-context(body.dark-mode) .content-section {
      background: #141414;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    :host-context(body.dark-mode) .section-header h2 {
      color: #e0e0e0;
    }

    .toggle-btn {
      padding: 0.5rem 1rem;
      background: #28aad1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .toggle-btn:hover {
      background: #2391b2;
    }

    .submissions-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .profile-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  userStats$!: Observable<UserStats>;
  expandedSong: string | null = null;
  showAchievements = false;
  achievements: UserAchievement[] = [];
  totalAchievements: number;

  constructor(
    private route: ActivatedRoute,
    private userStatsService: UserStatsService,
    private achievementService: AchievementService
  ) {
    this.totalAchievements = this.achievementService.getTotalAchievements();
  }

  ngOnInit() {
    this.userStats$ = this.route.params.pipe(
      switchMap(params => 
        this.userStatsService.getUserStats(params['username']).pipe(
          tap(stats => {
            this.achievements = this.achievementService.calculateAchievements(stats);
          })
        )
      )
    );
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
  }

  filterSubmissionsForUser(song: SongWithSubmissions, username: string): SongWithSubmissions {
    return {
      ...song,
      submissions: song.submissions.filter(sub => sub.contributor === username)
    };
  }
  
  toggleSong(song: SongWithSubmissions) {
    this.expandedSong = this.expandedSong === song.id ? null : song.id;
  }

  getCompletedAchievements(achievements: UserAchievement[]): number {
    return achievements.filter(a => a.isCompleted).length;
  }
}