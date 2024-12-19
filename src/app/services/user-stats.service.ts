import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongService } from './song.service';
import { LeaderboardService } from './leaderboard.service';
import { UserStats } from '../models/user-stats.interface';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { ContributorStats } from '../models/contributor-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  constructor(
    private songService: SongService,
    private leaderboardService: LeaderboardService
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

        const firstSubmissions = userSongs.filter(song => 
          song.submissions.some(sub => sub.contributor === username && sub.firstSub)
        );

        return {
          username,
          rank: contributor.rank,
          firstRank: contributor.firstRank,
          submissionCount: contributor.count,
          firstSubmissionCount: contributor.firstCount,
          highestDifficulty,
          lowestDifficulty,
          avgDifficulty,
          songs: userSongs
        };
      })
    );
  }
}