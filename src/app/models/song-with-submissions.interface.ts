import { Song } from './song.interface';
import { Submission } from './submission.interface';

export interface SongWithSubmissions extends Song {
  id: string;
  submissions: Submission[];
}