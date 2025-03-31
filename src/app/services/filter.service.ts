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
          (filters.videoFilter === 'without' && song.submissions.length === 0 && !song.subPending) ||
          (filters.videoFilter === 'pending' && song.subPending && song.submissions.length === 0);

        const matchesDifficulty =
          song.difficulty >= filters.minDifficulty && 
          song.difficulty <= filters.maxDifficulty;

        const matchesNoteCount =
          song.arrows >= filters.minNoteCount &&
          song.arrows <= filters.maxNoteCount;

        const matchesLength =
          song.seconds >= filters.minLength &&
          song.seconds <= filters.maxLength;

          const releaseDateWithin = (!filters.releaseDateStart && !filters.releaseDateEnd) || 
          (song.release && (
            (!filters.releaseDateStart || song.release >= new Date(filters.releaseDateStart)) &&
            (!filters.releaseDateEnd || song.release <= new Date(filters.releaseDateEnd))
          ));

        const matchesAAAA = !filters.aaaaOnly || 
          (song.submissions.some(sub => sub.isAAAA));

        return matchesSearch && matchesGenre && matchesVideo && 
              matchesDifficulty && matchesNoteCount && 
              matchesLength && releaseDateWithin && matchesAAAA;
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

    // Order submissions within each song based on scroll preference and priority
    return filteredSongs.map(song => ({
      ...song,
      submissions: [...song.submissions].sort((a, b) => {
        // First, check if scroll preferences match
        const aMatchesPreference = filters.scrollPreference === 'upscroll' ? !a.isDownscroll : a.isDownscroll;
        const bMatchesPreference = filters.scrollPreference === 'upscroll' ? !b.isDownscroll : b.isDownscroll;

        if (aMatchesPreference !== bMatchesPreference) {
          return aMatchesPreference ? -1 : 1;
        }

        // If scroll preferences are the same, check featured status
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }

        // If featured status is the same, check first submission status
        if (a.firstSub !== b.firstSub) {
          return a.firstSub ? -1 : 1;
        }

        // If all priorities are the same, maintain original order
        return 0;
      })
    }));
  }
}