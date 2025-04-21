import { Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { AchievementService } from './achievement.service';
import { SongService } from './song.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContributorStats } from '../models/contributor-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  constructor(
    private submissionService: SubmissionService,
    private achievementService: AchievementService,
    private songService: SongService
  ) {}

  getContributorStats(): Observable<ContributorStats[]> {
    return combineLatest([
      this.submissionService.getAllSubmissions(),
      this.songService.getSongs()
    ]).pipe(
      map(([submissions, songs]) => {
        // Count submissions and first submissions per contributor
        const contributorCounts = submissions.reduce((acc, submission) => {
          const contributor = submission.contributor;
          if (!acc[contributor]) {
            acc[contributor] = { 
              total: 0, 
              firsts: 0,
              submissions: []
            };
          }
          acc[contributor].total++;
          if (submission.firstSub) {
            acc[contributor].firsts++;
          }
          acc[contributor].submissions.push(submission);
          return acc;
        }, {} as Record<string, {
          total: number; 
          firsts: number;
          submissions: any[];
        }>);

        // Convert to array and calculate achievement counts
        const stats = Object.entries(contributorCounts)
          .map(([name, counts]) => {
            // Get songs for this contributor
            const userSongs = songs.filter(song => 
              song.submissions.some(sub => sub.contributor === name)
            );

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
                sub.contributor === name && sub.isAAAA
              ).length, 0
            );

            const downscrollSubmissionCount = userSongs.reduce((count, song) => 
              count + song.submissions.filter(sub => 
                sub.contributor === name && sub.isDownscroll
              ).length, 0
            );

            const oddScrollSubmissionCount = userSongs.reduce((count, song) => 
              count + song.submissions.filter(sub => 
                sub.contributor === name && sub.isOddScroll
              ).length, 0
            );

            // Calculate achievements using complete user stats
            const achievementCount = this.achievementService.calculateAchievements({
              username: name,
              rank: 0,
              firstRank: 0,
              achievementRank: 0,
              submissionCount: counts.total,
              firstSubmissionCount: counts.firsts,
              aaaaSubmissionCount,
              downscrollSubmissionCount,
              oddScrollSubmissionCount,
              highestDifficulty,
              lowestDifficulty,
              avgDifficulty,
              achievements: { 
                total: 0, 
                completed: 0, 
                secret: { total: 0, completed: 0 }, 
                list: [] 
              },
              songs: userSongs
            }).filter(a => a.isCompleted).length;

            return {
              name,
              count: counts.total,
              firstCount: counts.firsts,
              achievementCount,
              rank: 0,
              firstRank: 0,
              achievementRank: 0
            };
          });

        // Calculate ranks
        this.calculateRanks(stats);

        return stats;
      })
    );
  }

  private calculateRanks(stats: ContributorStats[]): void {
    // Sort and assign total submission ranks
    stats.sort((a, b) => b.count - a.count);
    let currentRank = 1;
    let currentCount = -1;
    let tiedCount = 0;

    stats.forEach((stat, index) => {
      if (stat.count !== currentCount) {
        currentRank = index + 1;
        currentCount = stat.count;
        tiedCount = 0;
      } else {
        tiedCount++;
      }
      stat.rank = currentRank;
    });

    // Sort and assign first submission ranks
    stats.sort((a, b) => b.firstCount - a.firstCount);
    currentRank = 1;
    let currentFirstCount = -1;
    tiedCount = 0;

    stats.forEach((stat, index) => {
      if (stat.firstCount !== currentFirstCount) {
        currentRank = index + 1;
        currentFirstCount = stat.firstCount;
        tiedCount = 0;
      } else {
        tiedCount++;
      }
      stat.firstRank = currentRank;
    });

    // Sort and assign achievement ranks
    stats.sort((a, b) => b.achievementCount - a.achievementCount);
    currentRank = 1;
    let currentAchievementCount = -1;
    tiedCount = 0;

    stats.forEach((stat, index) => {
      if (stat.achievementCount !== currentAchievementCount) {
        currentRank = index + 1;
        currentAchievementCount = stat.achievementCount;
        tiedCount = 0;
      } else {
        tiedCount++;
      }
      stat.achievementRank = currentRank;
    });

    // Return to original total submission sort
    stats.sort((a, b) => b.count - a.count);
  }
}