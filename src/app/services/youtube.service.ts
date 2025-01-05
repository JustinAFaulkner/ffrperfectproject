import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';

export interface YoutubeStats {
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private readonly apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(
    private http: HttpClient,
    private logger: LoggingService
  ) {}

  getChannelStats(): Observable<YoutubeStats> {
    const url = `${this.apiUrl}/channels`;
    const params = {
      part: 'statistics',
      id: environment.youtube.channelId,
      key: environment.youtube.apiKey
    };

    this.logger.info('Fetching YouTube channel stats');

    return this.http.get(url, { params }).pipe(
      map((response: any) => {
        const stats = response.items[0]?.statistics;
        if (!stats) {
          throw new Error('No channel statistics found');
        }

        return {
          subscriberCount: parseInt(stats.subscriberCount) || 0,
          viewCount: parseInt(stats.viewCount) || 0,
          videoCount: parseInt(stats.videoCount) || 0
        };
      }),
      catchError(error => {
        this.logger.error('Error fetching YouTube stats:', error);
        return of({
          subscriberCount: 0,
          viewCount: 0,
          videoCount: 0
        });
      })
    );
  }
}