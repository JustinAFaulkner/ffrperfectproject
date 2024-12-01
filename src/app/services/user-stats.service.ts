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

        const highestDifficulty = Math.max(
          ...userSongs.map((song: SongWithSubmissions) => song.difficulty)
        );

        const lowestDifficulty = Math.min(
            ...userSongs.map((song: SongWithSubmissions) => song.difficulty)
        );

        const avgDifficulty = (userSongs.reduce((sum, s) => sum + s.difficulty, 0)) / userSongs.length;

        return {
          username,
          rank: contributor.rank,
          submissionCount: contributor.count,
          highestDifficulty,
          lowestDifficulty,
          avgDifficulty,
          songs: userSongs
        };
      })
    );
  }
}