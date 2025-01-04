import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongService } from './song.service';
import { LeaderboardService } from './leaderboard.service';
import { AchievementService } from './achievement.service';
import { UserStats } from '../models/user-stats.interface';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { ContributorStats } from '../models/contributor-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  constructor(
    private songService: SongService,
    private leaderboardService: LeaderboardService,
    private achievementService: AchievementService
  ) {}

  getUserStats(username: string): Observable<UserStats> {
    return combineLatest([
      this.songService.getSongs(),
      this.leaderboardService.getContributorStats()
    ]).pipe(
      map(([songs, contributors]: [SongWithSubmissions[], ContributorStats[]]) => {
        const userSongs = songs.filter((song: SongWithSubmissions) => 
          song.submissions.some((sub) => sub.contributor === username)
        );

        const contributor = contributors.find((c: ContributorStats) => c.name === username);
        if (!contributor) {
          throw new Error('User not found');
        }

        const difficulties = userSongs.map(song => song.difficulty);
        const highestDifficulty = Math.max(...difficulties, 0);
        const lowestDifficulty = Math.min(...difficulties, 100);
        const avgDifficulty = difficulties.length > 0 
          ? difficulties.reduce((a, b) => a + b, 0) / difficulties.length 
          : 0;

        // Calculate achievements
        const achievementsList = this.achievementService.calculateAchievements({
          username,
          rank: contributor.rank,
          firstRank: contributor.firstRank,
          achievementRank: contributor.achievementRank,
          submissionCount: contributor.count,
          firstSubmissionCount: contributor.firstCount,
          highestDifficulty,
          lowestDifficulty,
          avgDifficulty,
          achievements: { total: 0, completed: 0, secret: { total: 0, completed: 0 }, list: [] },
          songs: userSongs
        });

        // Calculate achievement counts
        const completedAchievements = achievementsList.filter(a => a.isCompleted);
        const secretAchievements = achievementsList.filter(a => a.isSecret);
        const completedSecretAchievements = secretAchievements.filter(a => a.isCompleted);

        return {
          username,
          rank: contributor.rank,
          firstRank: contributor.firstRank,
          achievementRank: contributor.achievementRank,
          submissionCount: contributor.count,
          firstSubmissionCount: contributor.firstCount,
          highestDifficulty,
          lowestDifficulty,
          avgDifficulty,
          achievements: {
            total: achievementsList.length,
            completed: completedAchievements.length,
            secret: {
              total: secretAchievements.length,
              completed: completedSecretAchievements.length
            },
            list: achievementsList
          },
          songs: userSongs
        };
      })
    );
  }
}