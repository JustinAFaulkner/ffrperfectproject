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
      stepartist: 'Shashakiro'
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
      youtubeUrl2: 'https://www.youtube.com/embed/IbLMVSU0vMQ',
      contributor2: 'Ziergdsx18',
      stepartist: 'TC_Halogen'
    },
    {
      id: 3873,
      title: 'At The Ground\'s Edge',
      artist: '816ThreeNumbers feat. KANAOKOProject',
      duration: '2:29',
      genre: 'Misc',
      difficulty: 86,
      arrows: 1709,
      stepartist: 'gold stinger'
    },
    {
      id: 957,
      title: 'Mario Minor',
      artist: 'Powerglove',
      duration: '3:53',
      difficulty: 81,
      arrows: 2450,
      genre: 'Arcade',
      stepartist: 'behanjc',
      youtubeUrl: 'http://www.youtube.com/embed/j24kIZ0TbO4',
      contributor: 'iironiic'
    },
    {
      id: 936,
      title: 'Eradication',
      artist: 'All Shall Perish',
      duration: '1:54',
      genre: 'Rock',
      difficulty: 81,
      arrows: 1342,
      youtubeUrl: 'https://www.youtube.com/embed/1swWWv2DZOg',
      contributor: 'Lambdadelta',
      stepartist: 'ElectricWerewolf',
      stepartist2: 'bluguerrilla'
    },
  ];

  getSongs(): Song[] {
    return this.songs;
  }
}
