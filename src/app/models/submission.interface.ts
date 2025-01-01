export interface Submission {
  id: string;
  songId: number;
  url: string;
  contributor: string;
  songWikiUpdated: boolean;
  userWikiUpdated: boolean;
  firstSub: boolean;
  isPublic: boolean;
  isMulti: boolean;
}