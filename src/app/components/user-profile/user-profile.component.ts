import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SongItemComponent } from '../song-list/song-item.component';
import { UserStatsService } from '../../services/user-stats.service';
import { Observable, switchMap } from 'rxjs';
import { UserStats } from '../../models/user-stats.interface';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, SongItemComponent],
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
        </div>
        <a 
          [href]="'https://www.flashflashrevolution.com/profile/' + stats.username"
          target="_blank"
          class="ffr-profile-btn">
          View FFR Profile
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>

      <h2 class="submissions-title">Submissions</h2>
      <div class="submissions-list">
        <app-song-item
          *ngFor="let song of stats.songs"
          [song]="filterSubmissionsForUser(song, stats.username)"
          [isExpanded]="expandedSong === song.id"
          [showFirstIndicator]="true"
          (expandToggle)="toggleSong(song)">
        </app-song-item>
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

    .rank-badges {
      display: flex;
      gap: 10px;
    }

    .rank-badge.firsts {
      background: linear-gradient(135deg, #28aad1 0%, #3dbde4 100%);
      color: white;
    }

    .rank-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 500;
      color: #333;
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

    .submissions-title {
      margin: 20px 0;
      color: #333;
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

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  userStats$!: Observable<UserStats>;
  expandedSong: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userStatsService: UserStatsService
  ) {}

  ngOnInit() {
    this.userStats$ = this.route.params.pipe(
      switchMap(params => this.userStatsService.getUserStats(params['username']))
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
}