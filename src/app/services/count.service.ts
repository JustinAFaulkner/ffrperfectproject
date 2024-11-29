import { Injectable } from '@angular/core';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  getVideoCounts(songs: SongWithSubmissions[]) {
    return {
      withVideo: songs.filter(song => song.submissions.length > 0).length,
      withoutVideo: songs.filter(song => song.submissions.length === 0).length
    };
  }
}