import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterSongs(
    songs: Song[],
    {
      searchTerm = '',
      selectedGenre = '',
      videoFilter = 'all',
      minDifficulty = 0,
      maxDifficulty = 999,
    }: {
      searchTerm?: string;
      selectedGenre?: string;
      videoFilter?: 'all' | 'with' | 'without';
      minDifficulty?: number;
      maxDifficulty?: number;
    }
  ): Song[] {
    return songs.filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre = !selectedGenre || song.genre === selectedGenre;

      const matchesVideo =
        videoFilter === 'all' ||
        (videoFilter === 'with' && song.youtubeUrl) ||
        (videoFilter === 'without' && !song.youtubeUrl);

      const matchesDifficulty =
        song.difficulty >= minDifficulty && song.difficulty <= maxDifficulty;

      return matchesSearch && matchesGenre && matchesVideo && matchesDifficulty;
    });
  }
}