import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, tap } from 'rxjs';
import { SyncLog } from '../models/sync-log.interface';
import { SyncLogDetails, SyncLogChange, SongChange } from '../models/sync-log-details.interface';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class SyncLogService {
  private readonly baseUrl = 'https://ffrperfectproject.com/api/sync-log';

  constructor(
    private http: HttpClient,
    private logger: LoggingService
  ) {}

  getSyncLogs(): Observable<SyncLog[]> {
    this.logger.info('Fetching sync logs');
    
    return this.http.get(this.baseUrl, { responseType: 'text' }).pipe(
      tap(html => {
        this.logger.info('Received directory listing');
      }),
      map(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.getElementsByTagName('a'));
        
        return links
          .map(link => link.getAttribute('href'))
          .filter((filename): filename is string => 
            !!filename && filename.endsWith('.json')
          )
          .map(filename => ({
            filename,
            timestamp: this.parseTimestampFromFilename(filename)
          }))
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }),
      catchError((error: HttpErrorResponse) => {
        this.logger.error('Error fetching sync logs', error);
        throw error;
      })
    );
  }

  getSyncLogDetails(filename: string): Observable<SyncLogDetails> {
    const url = `${this.baseUrl}/${filename}`;
    this.logger.info('Fetching sync log details', { url });
    
    return this.http.get<SyncLogChange[]>(url).pipe(
      tap(logFile => {
        this.logger.info('Received log file contents', { 
          changeCount: logFile?.length || 0 
        });
      }),
      map(logFile => {
        this.logger.info('Processing sync log changes');
        
        const changes: SongChange[] = logFile.map(change => {
          const songChange: SongChange = {
            id: change.id.toString(),
            currentTitle: change.currentTitle,
            isNewSong: !!change.added,
            changes: []
          };

          if (!change.added) {
            // Process field changes
            Object.entries(change).forEach(([field, value]) => {
              if (field !== 'id' && field !== 'currentTitle' && typeof value === 'object') {
                songChange.changes.push({
                  field,
                  oldValue: value.old,
                  newValue: value.new
                });
              }
            });
          }

          return songChange;
        });

        return {
          timestamp: this.parseTimestampFromFilename(filename),
          changes
        };
      }),
      catchError(error => {
        this.logger.error('Error processing sync log details', error);
        throw error;
      })
    );
  }

  private parseTimestampFromFilename(filename: string): Date {
    const match = filename.match(/sync_(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})Z\.json/);
    if (!match) {
      this.logger.warn('Invalid filename format', { filename });
      return new Date(0);
    }
    const [_, year, month, day, hour, minute, second] = match;
    return new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));
  }
}