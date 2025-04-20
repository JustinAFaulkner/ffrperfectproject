import { SongWithSubmissions } from './song-with-submissions.interface';
import { UserAchievement } from './user-achievement.interface';

export interface UserStats {
  username: string;
  rank: number;
  firstRank: number;
  achievementRank: number;
  submissionCount: number;
  firstSubmissionCount: number;
  aaaaSubmissionCount: number;
  downscrollSubmissionCount: number;
  highestDifficulty: number;
  lowestDifficulty: number;
  avgDifficulty: number;
  achievements: {
    total: number;
    completed: number;
    secret: {
      total: number;
      completed: number;
    };
    list: UserAchievement[];
  };
  songs: SongWithSubmissions[];
}