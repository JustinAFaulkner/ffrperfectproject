import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, doc, setDoc, getDocs } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface FFRSong {
  id: number;
  name: string;
  author: string;
  stepauthor: string;
  genre: number;
  difficulty: number;
  length: string;
  note_count: number;
  min_nps: number;
  max_nps: number;
  timestamp: number;
  timestamp_format: string;
  swf_version: number;
}

interface FFRApiResponse {
    [key: string]: FFRSong;
}

@Injectable({
  providedIn: 'root'
})
export class SongSyncService {
  private readonly apiUrl = 'https://www.flashflashrevolution.com/api/api.php';
  private readonly songsCollection = 'songs';

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) {}

  private convertGenre(genreId: number): string {
    switch(genreId) {
      case 1: return 'Dance';
      case 2: return 'Dance 2';
      case 3: return 'Funk';
      case 4: return 'Arcade';
      case 5: return 'Rock';
      case 6: return 'Classical';
      case 7: return 'Misc';
      case 8: return 'Secret';
      case 9: return 'Purchased';
      case 10: return 'Token';
      case 11: return 'Hip-Hop';
      case 12: return 'Skill Token';
      case 13: return 'Legacy';
      default: return 'Unknown';
    }
  }

  private convertLength(length: string): number {
    const [minutes, seconds] = length.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  async syncNewSongs(): Promise<{ added: number, existing: number }> {
    try {
      // Get existing song IDs from Firestore
      const existingSongs = new Set<string>();
      const snapshot = await getDocs(collection(this.firestore, this.songsCollection));
      snapshot.forEach(doc => existingSongs.add(doc.id));

      // Fetch songs from FFR API
      const response = await firstValueFrom(
        this.http.get<FFRApiResponse>(
          `${this.apiUrl}?action=songlist&key=${environment.ffrApi.key}`
        )
      );

      let added = 0;
      let existing = 0;

      // Process each song
      for (const [id, song] of Object.entries(response)) {        
        if (added > 1) {
            break;
        }

        if (!existingSongs.has(song.id.toString())) {
          const songDoc = doc(this.firestore, this.songsCollection, song.id.toString());
          await setDoc(songDoc, {
            title: song.name,
            artist: song.author,
            stepArtist: song.stepauthor,
            genre: this.convertGenre(song.genre),
            difficulty: song.difficulty,
            seconds: this.convertLength(song.length),
            arrows: song.note_count,
            min_nps: song.min_nps,
            max_nps: song.max_nps,
            release: new Date(song.timestamp * 1000) //Multiple by 1000 as this timestamp is in seconds compared to milliseconds
          });
          added++;
        } else {
          existing++;
        }
      }

      return { added, existing };
    } catch (error) {
      console.error('Error syncing songs:', error);
      throw error;
    }
  }
}