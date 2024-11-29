import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { SubmissionService } from './submission.service';
import { Observable, from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { 
  Firestore, 
  collection, 
  getDocs,
  query,
  orderBy,
  DocumentData 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private readonly songsCollection = 'songs';

  constructor(
    private firestore: Firestore,
    private submissionService: SubmissionService
  ) {}

  getSongs(): Observable<SongWithSubmissions[]> {
    const songsRef = collection(this.firestore, this.songsCollection);
    const songsQuery = query(songsRef, orderBy('title'));
    
    return from(getDocs(songsQuery)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data()['title'] as string,
        artist: doc.data()['artist'] as string,
        seconds: doc.data()['seconds'] as number,
        genre: doc.data()['genre'] as string,
        difficulty: doc.data()['difficulty'] as number,
        arrows: doc.data()['arrows'] as number,
        stepartist: doc.data()['stepArtist'] as string,
        style: doc.data()['style'] as string | undefined,
      }))),
      switchMap((songs: (Song & { id: string })[]) => 
        this.submissionService.getAllSubmissions().pipe(
          map(submissionMap => 
            songs.map(song => ({
              ...song,
              submissions: submissionMap[song.id] || []
            }))
          )
        )
      ),
      take(1)
    );
  }
}