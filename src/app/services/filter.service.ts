import { Injectable } from '@angular/core';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { SongFilters } from '../models/song-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterSongs(
    songs: SongWithSubmissions[],
    filters: SongFilters
  ): SongWithSubmissions[] {
    let filteredSongs = songs.filter((song) => {
      if (filters.ids) {
        //A list of IDs has been passed explicitly, we don't need to check anything else
        return filters.ids.includes(song.id);
      }
      else {
        const searchLower = (filters.searchTerm || '').toLowerCase();

        const matchesSearch =
          !searchLower ||
          song.title?.toLowerCase().includes(searchLower) ||
          song.artist?.toLowerCase().includes(searchLower) ||
          song.stepArtist?.toLowerCase().includes(searchLower) ||
          song.style?.toLowerCase().includes(searchLower) ||
          song.submissions.some((submission) =>
            submission.contributor?.toLowerCase().includes(searchLower)
          );
  
        const matchesGenre = !filters.genre || song.genre === filters.genre;
  
        const matchesVideo =
          filters.videoFilter === 'all' ||
          (filters.videoFilter === 'with' && song.submissions.length > 0) ||
          (filters.videoFilter === 'without' && song.submissions.length === 0);
  
        const matchesDifficulty =
          song.difficulty >= filters.minDifficulty && 
          song.difficulty <= filters.maxDifficulty;
  
        const matchesNoteCount =
          song.arrows >= filters.minNoteCount &&
          song.arrows <= filters.maxNoteCount;
  
        const matchesLength =
          song.seconds >= filters.minLength &&
          song.seconds <= filters.maxLength;
  
        const matchesReleaseDate = !filters.releaseDate ||
          (song.release && song.release >= new Date(filters.releaseDate));
  
        return matchesSearch && matchesGenre && matchesVideo && 
               matchesDifficulty && matchesNoteCount && 
               matchesLength && matchesReleaseDate;
      }
    });

    // Apply sorting
    filteredSongs.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'id':
          comparison = Number(a.id) - Number(b.id);
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'difficulty':
          comparison = (a.difficulty || 0) - (b.difficulty || 0);
          break;
        case 'seconds':
          comparison = (a.seconds || 0) - (b.seconds || 0);
          break;
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return filteredSongs;
  }
}