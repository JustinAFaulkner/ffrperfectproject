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
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //song.contributor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //song.contributor2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.stepartist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.stepartist2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.stepartist3?.toLowerCase().includes(searchTerm.toLowerCase());

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
