import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongService } from './song.service';
import { YoutubeService } from './youtube.service';
import { AchievementService } from './achievement.service';
import { ScoringService } from './scoring.service';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';

export interface ProjectStats {
  totalSongs: number;
  totalArtists: number;
  totalSubmissions: number;
  totalArrows: number;
  totalAchievements: number;
  level: number;
  subscribers: number;
  views: number;
  credits: number;
  grandTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(
    private songService: SongService,
    private youtubeService: YoutubeService,
    private achievementService: AchievementService,
    private scoringService: ScoringService
  ) {}

  getProjectStats(): Observable<ProjectStats> {
    return combineLatest([
      this.songService.getSongs(),
      this.youtubeService.getChannelStats()
    ]).pipe(
      map(([songs, youtubeStats]) => {
        const artists = new Set(songs.map(song => song.artist));
        const totalSubmissions = songs.reduce((sum, song) => 
          sum + song.submissions.length, 0
        );
        const totalAchievements = this.calculateTotalAchievements(songs);
        const scores = this.scoringService.calculateScores(songs);

        return {
          totalSongs: songs.length,
          totalArtists: artists.size,
          totalSubmissions,
          totalArrows: scores.totalArrows,
          totalAchievements,
          level: scores.level,
          subscribers: youtubeStats.subscriberCount,
          views: youtubeStats.viewCount,
          credits: scores.credits,
          grandTotal: scores.grandTotal
        };
      })
    );
  }

  private calculateTotalAchievements(songs: SongWithSubmissions[]): number {
    // Get unique contributors
    const contributors = new Set(
      songs.flatMap(song => 
        song.submissions.map(sub => sub.contributor)
      )
    );

    // For each contributor, calculate their completed achievements
    return Array.from(contributors).reduce((total, contributor) => {
      const userSongs = songs.filter(song => 
        song.submissions.some(sub => sub.contributor === contributor)
      );

      const achievements = this.achievementService.calculateAchievements({
        username: contributor,
        rank: 0,
        firstRank: 0,
        achievementRank: 0,
        submissionCount: userSongs.length,
        firstSubmissionCount: 0,
        highestDifficulty: 0,
        lowestDifficulty: 0,
        avgDifficulty: 0,
        achievements: { total: 0, completed: 0, secret: { total: 0, completed: 0 }, list: [] },
        songs: userSongs
      });

      return total + achievements.filter(a => a.isCompleted).length;
    }, 0);
  }
}