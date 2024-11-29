import { Injectable } from '@angular/core';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterSongs(
    songs: SongWithSubmissions[],
    {
      searchTerm = '',
      selectedGenre = '',
      videoFilter = 'all',
      minDifficulty = 0,
      maxDifficulty = 150,
    }: {
      searchTerm?: string;
      selectedGenre?: string;
      videoFilter?: 'all' | 'with' | 'without';
      minDifficulty?: number;
      maxDifficulty?: number;
    }
  ): SongWithSubmissions[] {
    return songs.filter((song) => {
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.toLowerCase().includes(searchLower) ||
        song.stepartist?.toLowerCase().includes(searchLower) ||
        song.style?.toLowerCase().includes(searchLower) ||
        song.submissions.some((submission) =>
          submission.contributor.toLowerCase().includes(searchLower)
        );

      const matchesGenre = !selectedGenre || song.genre === selectedGenre;

      const matchesVideo =
        videoFilter === 'all' ||
        (videoFilter === 'with' && song.submissions.length > 0) ||
        (videoFilter === 'without' && song.submissions.length === 0);

      const matchesDifficulty =
        song.difficulty >= minDifficulty && song.difficulty <= maxDifficulty;

      return matchesSearch && matchesGenre && matchesVideo && matchesDifficulty;
    });
  }
}

function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value === '';
}
