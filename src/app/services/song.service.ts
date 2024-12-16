import { Injectable } from '@angular/core';
import { Song } from '../models/song.interface';
import { SongWithSubmissions } from '../models/song-with-submissions.interface';
import { SubmissionService } from './submission.service';
import { Observable, BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SongSyncService } from './song-sync.service';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songsSubject = new BehaviorSubject<SongWithSubmissions[]>([]);
  public songs$ = this.songsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private submissionService: SubmissionService,
    private songSyncService: SongSyncService
  ) {
    this.loadSongs();
    
    this.submissionService.submissionUpdates$.subscribe(() => {
      this.loadSongs();
    });

    this.songSyncService.songUpdate$.subscribe(songId => {
      this.refreshSong(songId);
    });
  }

  private loadSongs(): void {
    combineLatest([
      this.apiService.getAllSongs(),
      this.submissionService.getAllSubmissions()
    ]).pipe(
      map(([songs, submissions]) => {
        return songs.map(song => this.processSong(song, submissions));
      })
    ).subscribe(songs => this.songsSubject.next(songs));
  }

  private processSong(song: Song, submissions: any[]): SongWithSubmissions {
    const processedSong: Song = {
      ...song,
      stepArtist: song.stepArtist || 'Unknown',
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
  }

  private async refreshSong(songId: string): Promise<void> {
    try {
      const [updatedSong, submissions] = await Promise.all([
        firstValueFrom(this.apiService.getSong(songId)),
        firstValueFrom(this.submissionService.getAllSubmissions())
      ]);

      if (!updatedSong) {
        console.error('No song data received');
        return;
      }

      if (!submissions) {
        console.error('No submissions data received');
        return;
      }

      const currentSongs = this.songsSubject.value;
      const updatedSongs = currentSongs.map(song => {
        if (song.id === songId) {
          return this.processSong(updatedSong, submissions);
        }
        return song;
      });

      this.songsSubject.next(updatedSongs);
    } catch (error) {
      console.error('Error refreshing song:', error);
    }
  }

  getSongs(): Observable<SongWithSubmissions[]> {
    return this.songs$;
  }
}