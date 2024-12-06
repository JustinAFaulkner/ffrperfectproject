export interface Submission {
  id: string;
  songId: number;
  youtubeUrl: string;
  contributor: string;
  songWikiUpdated: boolean;
  userWikiUpdated: boolean;
  firstSub: boolean;
}