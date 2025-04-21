import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { SongItemComponent } from '../song-list/song-item.component';
import { UserStatsService } from '../../services/user-stats.service';
import { AchievementService } from '../../services/achievement.service';
import { UserAchievementsComponent } from './user-achievements.component';
import { ProfileHeaderComponent } from './profile-header.component';
import { StatsCardsComponent } from './stats-cards.component';
import { ContentTabsComponent } from './content-tabs.component';
import { UserStats } from '../../models/user-stats.interface';
import { UserAchievement } from '../../models/user-achievement.interface';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    SongItemComponent,
    UserAchievementsComponent,
    ProfileHeaderComponent,
    StatsCardsComponent,
    ContentTabsComponent
  ],
  template: `
    <div class="profile-container" *ngIf="userStats$ | async as stats">
      <app-profile-header
        [username]="stats.username"
        [rank]="stats.rank"
        [firstRank]="stats.firstRank"
        [achievementRank]="stats.achievementRank"
        [completedAchievements]="stats.achievements.total == stats.achievements.completed"
        (achievementsClick)="activeTab = 'achievements'">
      </app-profile-header>

      <app-stats-cards
        [submissionCount]="stats.submissionCount"
        [firstSubmissionCount]="stats.firstSubmissionCount"
        [completedAchievements]="stats.achievements.completed"
        [totalAchievements]="stats.achievements.total"
        [highestDifficulty]="stats.highestDifficulty"
        [avgDifficulty]="stats.avgDifficulty"
        [lowestDifficulty]="stats.lowestDifficulty"
        [aaaaSubmissionCount]="stats.aaaaSubmissionCount"
        [downscrollSubmissionCount]="stats.downscrollSubmissionCount"
        (achievementsClick)="activeTab = 'achievements'">
      </app-stats-cards>

      <app-content-tabs
        [activeTab]="activeTab"
        [submissionCount]="stats.submissionCount"
        [achievementCount]="stats.achievements.completed"
        [totalAchievements]="stats.achievements.total"
        (tabChange)="activeTab = $event">
      </app-content-tabs>

      <div class="content-container" [class.fade]="true">
        <ng-container *ngIf="activeTab === 'submissions'">
          <div class="submissions-list">
            <app-song-item
              *ngFor="let song of stats.songs"
              [song]="filterSubmissionsForUser(song, stats.username)"
              [isExpanded]="expandedSong === song.id"
              [showFirstIndicator]="true"
              (expandToggle)="toggleSong(song)">
            </app-song-item>
          </div>
        </ng-container>

        <ng-container *ngIf="activeTab === 'achievements'">
          <app-user-achievements 
            [achievements]="achievements">
          </app-user-achievements>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .content-container {
      opacity: 0;
      transform: translateY(10px);
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .submissions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class UserProfileComponent {
  userStats$!: Observable<UserStats>;
  expandedSong: string | null = null;
  achievements: UserAchievement[] = [];
  activeTab: 'submissions' | 'achievements' = 'submissions';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userStatsService: UserStatsService,
    private achievementService: AchievementService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    
    this.userStats$ = this.route.params.pipe(
      switchMap(params => 
        this.userStatsService.getUserStats(params['username']).pipe(
          tap(stats => {
            this.achievements = stats.achievements.list;
          })
        )
      )
    );
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