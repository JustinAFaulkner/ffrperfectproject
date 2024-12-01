import { SongWithSubmissions } from './song-with-submissions.interface';

export interface UserStats {
  username: string;
  rank: number;
  submissionCount: number;
  highestDifficulty: number;
  lowestDifficulty: number;
  avgDifficulty: number;
  songs: SongWithSubmissions[];
}