export interface SongFilters {
  searchTerm: string;
  genre: string;
  videoFilter: 'all' | 'with' | 'without' | 'pending';
  minDifficulty: number;
  maxDifficulty: number;
  minNoteCount: number;
  maxNoteCount: number;
  minLength: number;
  maxLength: number;
  releaseDateStart: Date | null;
  releaseDateEnd: Date | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  ids: string[] | undefined;
  scrollPreference: 'upscroll' | 'downscroll';
  aaaaOnly: boolean;
}

export const defaultFilters: SongFilters = {
  searchTerm: '',
  genre: '',
  videoFilter: 'all',
  minDifficulty: 0,
  maxDifficulty: 150,
  minNoteCount: 0,
  maxNoteCount: 99999,
  minLength: 0,
  maxLength: 9999,
  releaseDateStart: null,
  releaseDateEnd: null,
  sortBy: 'id',
  sortDirection: 'asc',
  ids: undefined,
  scrollPreference: 'upscroll',
  aaaaOnly: false
};