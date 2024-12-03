export interface SongFilters {
    searchTerm: string;
    genre: string;
    videoFilter: 'all' | 'with' | 'without';
    minDifficulty: number;
    maxDifficulty: number;
    minNoteCount: number;
    maxNoteCount: number;
    minLength: number;
    maxLength: number;
    releaseDate: Date | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
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
    releaseDate: null,
    sortBy: 'id',
    sortDirection: 'asc'
  };