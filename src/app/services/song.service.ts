import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { SubmissionService } from './submission.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songsSubject = new BehaviorSubject<SongWithSubmissions[]>([]);
  public songs$ = this.songsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private submissionService: SubmissionService
  ) {
    this.loadSongs();
    
    // Subscribe to submission updates
    this.submissionService.submissionUpdates$.subscribe(() => {
      this.loadSongs();
    });
  }

  private loadSongs(): void {
    combineLatest([
      this.apiService.getAllSongs(),
      this.submissionService.getAllSubmissions()
    ]).pipe(
      map(([songs, submissions]) => {
        return songs.map(song => {
          // Ensure song has all required properties
          const processedSong: Song = {
            ...song,
            stepArtist: song.stepArtist || 'Unknown', // Map stepArtist to stepartist
            seconds: typeof song.seconds === 'number' ? song.seconds : 0,
            release: song.release ? new Date(song.release) : new Date(0)
          };

          const songId = song.id.toString();
          const songSubmissions = submissions.filter(sub => 
            sub.songId.toString() === songId
          );
          
          return {
            ...processedSong,
            submissions: songSubmissions
          };
        });
      })
    ).subscribe(songs => this.songsSubject.next(songs));
  }

  getSongs(): Observable<SongWithSubmissions[]> {
    return this.songs$;
  }
}