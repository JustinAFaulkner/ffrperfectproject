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
  representedArtists: number;
  totalSubmissions: number;
  songsWithSubmissions: number;
  totalArrows: number;
  totalAchievements: number;
  totalContributors: number;
  downscrollCount: number;
  aaaaCount: number;
  songsWithAAAA: number;
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
        
        // Get songs with submissions
        const songsWithSubmissions = songs.filter(song => song.submissions.length > 0);
        
        // Get unique artists from songs with submissions
        const representedArtists = new Set(songsWithSubmissions.map(song => song.artist));
        
        const totalSubmissions = songs.reduce((sum, song) => 
          sum + song.submissions.length, 0
        );
        const totalAchievements = this.calculateTotalAchievements(songs);
        const scores = this.scoringService.calculateScores(songs);

        // Calculate unique contributors (case insensitive)
        const contributors = new Set(
          songs.flatMap(song => 
            song.submissions.map(sub => 
              sub.contributor.toLowerCase()
            )
          )
        );

        // Calculate downscroll count
        const downscrollCount = songs.reduce((sum, song) => 
          sum + song.submissions.filter(sub => sub.isDownscroll).length, 0
        );

        // Calculate AAAA stats
        const aaaaCount = songs.reduce((sum, song) => 
          sum + song.submissions.filter(sub => sub.isAAAA).length, 0
        );

        const songsWithAAAA = songs.filter(song => 
          song.submissions.some(sub => sub.isAAAA)
        ).length;

        return {
          totalSongs: songs.length,
          totalArtists: artists.size,
          representedArtists: representedArtists.size,
          totalSubmissions,
          songsWithSubmissions: songsWithSubmissions.length,
          totalArrows: scores.totalArrows,
          totalAchievements,
          totalContributors: contributors.size,
          downscrollCount,
          aaaaCount,
          songsWithAAAA,
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