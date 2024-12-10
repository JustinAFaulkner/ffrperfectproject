import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface SyncResponse {
  inserted: number;
  msg: string;
}

interface RefreshResponse {
  success: boolean;
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class SongSyncService {
  private readonly apiUrl = 'https://www.flashflashrevolution.com/api/api.php';
  private readonly syncUrl = 'https://ffrperfectproject.com/api/ffr-sync';

  constructor(private http: HttpClient) {}

  async syncNewSongs(): Promise<SyncResponse> {
    try {
      // Step 1: Fetch songs from FFR API
      const response = await firstValueFrom(
        this.http.get(
          `${this.apiUrl}?action=songlist&key=${environment.ffrApi.key}`,
          { responseType: 'json' }
        )
      );

      // Step 2: Send songs to sync endpoint as JSON
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
      // Step 1: Fetch song from FFR API
      const response = await firstValueFrom(
        this.http.get(
          `${this.apiUrl}?action=songlist&key=${environment.ffrApi.key}&levelid=${songId}`,
          { responseType: 'json' }
        )
      );

      // Get the first (and should be only) song from response
      const song = Object.values(response)[0];
      if (!song) {
        throw new Error('Song not found in API response');
      }

      // Step 2: Send song to refresh endpoint as JSON
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

      return refreshResponse.success;
    } catch (error) {
      console.error('Error resyncing song:', error);
      throw error;
    }
  }
}