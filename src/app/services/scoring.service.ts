import { Injectable } from '@angular/core';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {
  private readonly WEIGHT_PERCENTAGES = [
    0.2404, 0.1860, 0.1435, 0.1105, 0.0848,
    0.0647, 0.0491, 0.0370, 0.0275, 0.0202,
    0.0144, 0.0099, 0.0065, 0.0038, 0.0017
  ];

  calculateScores(songs: SongWithSubmissions[]) {
    // Calculate total arrows across all submissions
    const totalArrows = songs.reduce((total, song) => 
      total + (song.arrows * song.submissions.length), 0);

    // Calculate grand total score
    const grandTotal = (totalArrows * 550) + (totalArrows * 1000);
    
    // Calculate credits
    const credits = Math.floor(grandTotal / 50000);

    // Calculate level based on top 15 difficulties
    const level = this.calculateLevel(songs);

    return {
      totalArrows,
      grandTotal,
      credits,
      level: Math.round(level)
    };
  }

  private calculateLevel(songs: SongWithSubmissions[]): number {
    // Get all difficulties from songs with submissions
    const difficulties = songs
      .filter(song => song.submissions.length > 0)
      .map(song => song.difficulty);

    // Sort difficulties in descending order
    difficulties.sort((a, b) => b - a);

    // Take top 15 difficulties or pad with zeros
    const top15 = Array(15).fill(0)
      .map((_, i) => difficulties[i] || 0);

    // Calculate weighted sum
    return this.WEIGHT_PERCENTAGES.reduce((sum, weight, i) => 
      sum + (top15[i] * weight), 0);
  }
}