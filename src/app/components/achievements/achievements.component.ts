import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../services/achievement.service';
import { LeaderboardService } from '../../services/leaderboard.service';
import { SongService } from '../../services/song.service';
import { UserAchievement } from '../../models/user-achievement.interface';
import { ContributorStats } from '../../models/contributor-stats.interface';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';

interface AchievementWithStats extends UserAchievement {
  earnedCount: number;
  totalContributors: number;
  earnedPercentage: number;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="achievements-container">
      <h1>Achievement List</h1>
      
      <div class="achievements-grid">
        <div 
          *ngFor="let achievement of achievements$ | async" 
          class="achievement-card"
          [class.badge-achievement]="achievement.givesBadge"
          [class.secret]="achievement.isSecret">
          <div class="achievement-icon">
            <i *ngIf="!achievement.givesBadge" class="fas" [class]="getIconClass(achievement)"></i>
            <img *ngIf="achievement.givesBadge" [src]="getBadgeIcon(achievement)" alt="Badge" />
          </div>
          <div class="achievement-content">
            <div class="achievement-header">
              <h3>{{achievement.name}}</h3>
              <div *ngIf="achievement.givesBadge" class="badge-indicator">
                <i class="fas fa-award"></i>
                <span class="badge-tooltip">Awards FFR Profile Badge!</span>
              </div>
            </div>
            <p>
              {{achievement.description}}
            </p>
            <div class="achievement-stats">
              <div class="progress-bar">
                <div 
                  class="progress" 
                  [style.width.%]="achievement.earnedPercentage">
                </div>
              </div>
              <span class="stats-text">
                {{ achievement.earnedCount }} / {{ achievement.totalContributors }}
                contributors ({{ achievement.earnedPercentage | number:'1.0-1' }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievements-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
      text-align: left;
      margin-left: 2rem;
    }

    :host-context(body.dark-mode) h1 {
      color: #e0e0e0;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .achievement-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    :host-context(body.dark-mode) .achievement-card {
      background: #2d2d2d;
    }

    .achievement-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent 0%, transparent 85%, rgba(255,255,255,0.1) 100%);
      transition: all 0.3s ease;
    }

    .achievement-card.badge-achievement {
      border-color: #28aad1;
      background: linear-gradient(135deg, white 0%, rgba(40, 170, 209, 0.1) 100%);
    }

    :host-context(body.dark-mode) .achievement-card.badge-achievement {
      background: linear-gradient(135deg, #2d2d2d 0%, rgba(40, 170, 209, 0.2) 100%);
    }

    .achievement-card.secret {
      border-color: #805ad5;
      background: linear-gradient(135deg, white 0%, rgba(128, 90, 213, 0.1) 100%);
    }

    :host-context(body.dark-mode) .achievement-card.secret {
      background: linear-gradient(135deg, #2d2d2d 0%, rgba(128, 90, 213, 0.2) 100%);
    }

    .achievement-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border-radius: 12px;
      background: #f7fafc;
      color: #718096;
      flex-shrink: 0;
    }

    :host-context(body.dark-mode) .achievement-icon {
      background: #333;
      color: #a0aec0;
    }

    .secret .achievement-icon {
      background: #805ad5;
      color: white;
    }

    .achievement-content {
      flex: 1;
      min-width: 0;
    }

    .achievement-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .achievement-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d3748;
    }

    :host-context(body.dark-mode) .achievement-header h3 {
      color: #e2e8f0;
    }

    .badge-indicator {
      position: relative;
      color: #28aad1;
      font-size: 1.2rem;
      cursor: help;
    }

    .badge-tooltip {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #28aad1;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
    }

    .badge-indicator:hover .badge-tooltip {
      opacity: 1;
      visibility: visible;
    }

    .achievement-content p {
      margin: 0 0 1rem;
      font-size: 0.9rem;
      color: #718096;
      line-height: 1.4;
    }

    :host-context(body.dark-mode) .achievement-content p {
      color: #a0aec0;
    }

    .achievement-content p.blur {
      filter: blur(4px);
      user-select: none;
    }

    .achievement-stats {
      margin-top: 0.5rem;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #edf2f7;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    :host-context(body.dark-mode) .progress-bar {
      background: #333;
    }

    .progress {
      height: 100%;
      background: #28aad1;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .stats-text {
      font-size: 0.8rem;
      color: #718096;
    }

    :host-context(body.dark-mode) .stats-text {
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .achievements-container {
        padding: 1rem;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AchievementsComponent implements OnInit {
  achievements$!: Observable<AchievementWithStats[]>;

  constructor(
    private achievementService: AchievementService,
    private leaderboardService: LeaderboardService,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.achievements$ = combineLatest([
      this.leaderboardService.getContributorStats(),
      this.songService.getSongs()
    ]).pipe(
      map(([contributors, songs]) => this.processAchievements(contributors, songs))
    );
  }

  private processAchievements(
    contributors: ContributorStats[], 
    allSongs: SongWithSubmissions[]
  ): AchievementWithStats[] {
    const totalContributors = contributors.length;
    const achievements = this.achievementService.calculateAchievements({
      username: '',
      rank: 0,
      firstRank: 0,
      achievementRank: 0,
      submissionCount: 0,
      firstSubmissionCount: 0,
      aaaaSubmissionCount: 0,
      downscrollSubmissionCount: 0,
      highestDifficulty: 0,
      lowestDifficulty: 0,
      avgDifficulty: 0,
      achievements: { total: 0, completed: 0, secret: { total: 0, completed: 0 }, list: [] },
      songs: []
    });

    return achievements.map(achievement => {
      const earnedCount = contributors.filter(contributor => {
        // Get songs for this contributor
        const userSongs = allSongs.filter(song => 
          song.submissions.some(sub => sub.contributor === contributor.name)
        );

        // Calculate total arrows/notes
        const totalArrows = userSongs.reduce((sum, song) => sum + song.arrows, 0);

        // Calculate difficulties
        const difficulties = userSongs.map(song => song.difficulty);
        const highestDifficulty = Math.max(...difficulties, 0);
        const lowestDifficulty = Math.min(...difficulties, 100);
        const avgDifficulty = difficulties.length > 0 
          ? difficulties.reduce((a, b) => a + b, 0) / difficulties.length 
          : 0;

        // Calculate AAAA and downscroll counts
        const aaaaSubmissionCount = userSongs.reduce((count, song) => 
          count + song.submissions.filter(sub => 
            sub.contributor === contributor.name && sub.isAAAA
          ).length, 0
        );

        const downscrollSubmissionCount = userSongs.reduce((count, song) => 
          count + song.submissions.filter(sub => 
            sub.contributor === contributor.name && sub.isDownscroll
          ).length, 0
        );

        // Check if the contributor has completed this achievement
        const userStats = {
          username: contributor.name,
          rank: contributor.rank,
          firstRank: contributor.firstRank,
          achievementRank: contributor.achievementRank,
          submissionCount: contributor.count,
          firstSubmissionCount: contributor.firstCount,
          aaaaSubmissionCount,
          downscrollSubmissionCount,
          highestDifficulty,
          lowestDifficulty,
          avgDifficulty,
          achievements: { total: 0, completed: 0, secret: { total: 0, completed: 0 }, list: [] },
          songs: userSongs
        };

        return this.achievementService.calculateAchievements(userStats)
          .find(a => a.id === achievement.id)?.isCompleted;
      }).length;

      return {
        ...achievement,
        earnedCount,
        totalContributors,
        earnedPercentage: (earnedCount / totalContributors) * 100
      };
    });
  }

  getBadgeIcon(achievement: UserAchievement): string {
    switch(achievement.name) {
      case 'In A Pickle':
        return "assets/icons/InAPickle.png";
      case 'Budding Pioneer':
        return "assets/icons/BuddingPioneer.png";
    }
    return "assets/icons/OutWalkin.png";
  }

  getIconClass(achievement: UserAchievement): string {
    if (achievement.isSecret && !achievement.description.includes('mysterious')) {
      return 'fa-question';
    }
    
    // Map achievement types to specific icons
    if (achievement.description.toLowerCase().includes('first aaa video')) return 'fa-file-arrow-up';
    if (achievement.description.toLowerCase().includes('aaa videos')) return 'fa-file-arrow-up';
    if (achievement.description.toLowerCase().includes('first')) return 'fa-map-location-dot';
    if (achievement.description.toLowerCase().includes('difficulty')) return 'fa-utensils';
    if (achievement.description.toLowerCase().includes('month')) return 'fa-calendar';
    if (achievement.description.toLowerCase().includes('repeating')) return 'fa-cubes';
    if (achievement.description.toLowerCase().includes('min')) return 'fa-masks-theater';
    if (achievement.description.toLowerCase().includes('hour')) return 'fa-business-time';
    if (achievement.description.toLowerCase().includes('alphabet')) return 'fa-arrow-down-a-z';
    if (achievement.description.toLowerCase().includes('notes')) return 'fa-music';
    if (achievement.description.toLowerCase().includes('genre')) return 'fa-compact-disc';
    if (achievement.description.toLowerCase().includes('public')) return 'fa-users';
    if (achievement.description.toLowerCase().includes('multi')) return 'fa-gamepad';
    if (achievement.description.toLowerCase().includes('on files from')) return 'fa-id-badge';
    
    // Default icon
    return 'fa-trophy';
  }
}