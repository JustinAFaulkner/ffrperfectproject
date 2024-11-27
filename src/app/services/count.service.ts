import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  getVideoCounts(songs: Song[]) {
    return {
      withVideo: songs.filter(song => song.youtubeUrl || song.youtubeUrl2).length,
      withoutVideo: songs.filter(song => !song.youtubeUrl && !song.youtubeUrl2).length
    };
  }
}