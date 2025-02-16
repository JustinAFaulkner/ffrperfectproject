export interface Song {
  id: string;
  title: string;
  artist: string;
  author_url: string;
  seconds: number;
  genre: string;
  difficulty: number;
  arrows: number;
  stepArtist: string;
  style?: string;
  release: Date;
  subPending: boolean;
}