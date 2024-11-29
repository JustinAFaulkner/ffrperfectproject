import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';
import { Observable } from 'rxjs';
import { 
  Firestore, 
  collection, 
  collectionData,
  query,
  orderBy 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private readonly songsCollection = 'songs';

  constructor(private firestore: Firestore) {}

  getSongs(): Observable<Song[]> {
    const songsRef = collection(this.firestore, this.songsCollection);
    const songsQuery = query(songsRef, orderBy('title'));
    return collectionData(songsQuery) as Observable<Song[]>;
  }
}