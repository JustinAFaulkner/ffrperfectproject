import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songs: Song[] = [
    {
      id: 208,
      title: 'Rottel-da-station',
      artist: 'Sampling Masters CHANG',
      duration: '1:59',
      genre: 'Secret',
      difficulty: 70,
      arrows: 1218,
      style: 'Gabba',
      youtubeUrl: 'https://www.youtube.com/embed/IbLMVSU0vMQ',
      contributor: 'Ziergdsx18',
    },
    {
      id: 1335,
      title: 'Tageri',
      artist: 'Sabrepulse',
      duration: '3:22',
      genre: 'Misc',
      difficulty: 87,
      arrows: 1945,
      youtubeUrl: 'https://www.youtube.com/embed/0iIXCnPjcbg',
      contributor: 'TC_Halogen',
    },
    {
      id: 3,
      title: 'Sweet Child O Mine',
      artist: 'Guns N Roses',
      duration: '5:56',
      genre: 'Rock',
      difficulty: 66,
      arrows: 2466,
      youtubeUrl: 'https://www.youtube.com/embed/1w7OgIMMRc4',
    },
    {
      id: 4,
      title: 'Take Five',
      artist: 'Dave Brubeck',
      duration: '5:24',
      difficulty: 105,
      arrows: 6492,
      genre: 'Jazz',
    },
    {
      id: 5,
      title: 'Lose Yourself',
      artist: 'Eminem',
      duration: '5:26',
      genre: 'Hip Hop',
      difficulty: 52,
      arrows: 2015,
      youtubeUrl: 'https://www.youtube.com/embed/_Yhyp-_hX2s',
    },
  ];

  getSongs(): Song[] {
    return this.songs;
  }
}
