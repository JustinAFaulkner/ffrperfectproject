import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom, Subject } from 'rxjs';
import { Song } from '../models/song.interface';

interface SyncResponse {
  inserted: number;
  msg: string;
}

interface RefreshResponse {
  data: Song;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SongSyncService {
  private readonly apiUrl = 'https://www.flashflashrevolution.com/api/api.php';
  private readonly syncUrl = 'https://ffrperfectproject.com/api/ffr-sync';
  
  private songUpdateSubject = new Subject<string>();
  public songUpdate$ = this.songUpdateSubject.asObservable();

  constructor(private http: HttpClient) {}

  async syncNewSongs(): Promise<SyncResponse> {
    try {
      const response = await firstValueFrom(
        this.http.get(
          `${this.apiUrl}?action=songlist&key=${environment.ffrApi.key}`,
          { responseType: 'json' }
        )
      );

      const payload = JSON.stringify({ songs: response });      
      const syncResponse = await firstValueFrom(
        this.http.post<SyncResponse>(
          `${this.syncUrl}?action=sync-new`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

      return syncResponse;
    } catch (error) {
      console.error('Error syncing songs:', error);
      throw error;
    }
  }

  async resyncSong(songId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get(
          `${this.apiUrl}?action=songlist&key=${environment.ffrApi.key}&levelid=${songId}`,
          { responseType: 'json' }
        )
      );

      const song = Object.values(response)[0];
      if (!song) {
        throw new Error('Song not found in API response');
      }

      const payload = JSON.stringify({ song: song });
      const refreshResponse = await firstValueFrom(
        this.http.post<RefreshResponse>(
          `${this.syncUrl}?action=refresh-song`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

      const success = (refreshResponse.message === "Song refreshed successfully");

      if (success) {
        this.songUpdateSubject.next(songId);
      }

      return success;
    } catch (error) {
      console.error('Error resyncing song:', error);
      throw error;
    }
  }
}