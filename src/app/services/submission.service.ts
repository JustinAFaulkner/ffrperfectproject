import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, map } from 'rxjs';
import { Submission } from '../models/submission.interface';
import { ApiService } from './api.service';
import { UrlTransformerService } from './url-transformer.service';
import { LoggingService } from './logging.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private submissionsCache$ = new ReplaySubject<Submission[]>(1);
  private submissionUpdatesSubject = new Subject<void>();
  public submissionUpdates$ = this.submissionUpdatesSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private urlTransformer: UrlTransformerService,
    private logger: LoggingService
  ) {
    this.loadSubmissions();
  }

  private loadSubmissions(): void {
    this.logger.info('Loading submissions from API');
    this.apiService.getAllSubmissions().pipe(
      map(submissions => {
        if (!Array.isArray(submissions)) {
          this.logger.warn('Received non-array submissions data', submissions);
          return [];
        }

        this.logger.info(`Received ${submissions.length} submissions from API`);
        
        // Ensure all required fields are present and properly typed
        const processedSubmissions = submissions.map(sub => ({
          id: sub.id || '',
          songId: typeof sub.songId === 'number' ? sub.songId : Number(sub.songId),
          url: this.urlTransformer.transformYoutubeUrl(sub.url || ''),
          contributor: sub.contributor || '',
          songWikiUpdated: Boolean(sub.songWikiUpdated),
          userWikiUpdated: Boolean(sub.userWikiUpdated),
          firstSub: Boolean(sub.firstSub),
          isPublic: Boolean(sub.isPublic),
          isMulti: Boolean(sub.isMulti),
          isFeatured: Boolean(sub.isFeatured),
          isDownscroll: Boolean(sub.isDownscroll),
          isAAAA: Boolean(sub.isAAAA)
        }));

        this.logger.info('Submissions processed', {
          original: submissions.length,
          processed: processedSubmissions.length,
          needUserWikiUpdate: processedSubmissions.filter(s => !s.userWikiUpdated).length,
          needSongWikiUpdate: processedSubmissions.filter(s => !s.songWikiUpdated).length
        });

        return processedSubmissions;
      })
    ).subscribe({
      next: (submissions) => {
        this.submissionsCache$.next(submissions);
      },
      error: (error) => {
        this.logger.error('Error loading submissions', error);
        // Initialize with empty array on error to prevent blocking the UI
        this.submissionsCache$.next([]);
      }
    });
  }

  getAllSubmissions(): Observable<Submission[]> {
    return this.submissionsCache$;
  }

  async updateWikiStatus(submissionId: string, type: 'user' | 'song'): Promise<void> {
    this.logger.info('Updating wiki status', { submissionId, type });
    try {
      const submissions = await firstValueFrom(this.getAllSubmissions());
      const submission = submissions?.find(s => s.id === submissionId);
  
      if (submission) {
        this.logger.info('Found submission to update', submission);
        await firstValueFrom(this.apiService.createOrUpdateSubmission({
          id: submissionId,
          songId: submission.songId,
          username: submission.contributor,
          url: submission.url,
          firstSub: submission.firstSub,
          songWikiUpdated: type === 'song' ? true : submission.songWikiUpdated,
          userWikiUpdated: type === 'user' ? true : submission.userWikiUpdated,
          isPublic: submission.isPublic,
          isMulti: submission.isMulti,
          isFeatured: submission.isFeatured,
          isDownscroll: submission.isDownscroll,
          isAAAA: submission.isAAAA
        }));
  
        this.loadSubmissions();
        this.submissionUpdatesSubject.next();
      } else {
        this.logger.warn('Submission not found for update', { submissionId });
        throw new Error('Submission not found');
      }
    } catch (error) {
      this.logger.error('Error updating wiki status', error);
      throw error;
    }
  }

  async addSubmission(songId: string, submission: Submission): Promise<void> {
    this.logger.info('Adding new submission', { songId, submission });
    try {
      await this.apiService.createOrUpdateSubmission({
        songId: Number(songId),
        username: submission.contributor,
        url: submission.url,
        firstSub: submission.firstSub,
        songWikiUpdated: submission.songWikiUpdated,
        userWikiUpdated: submission.userWikiUpdated,
        isPublic: submission.isPublic,
        isMulti: submission.isMulti,
        isFeatured: submission.isFeatured,
        isDownscroll: submission.isDownscroll,
        isAAAA: submission.isAAAA
      }).toPromise();

      this.loadSubmissions();
      this.submissionUpdatesSubject.next();
    } catch (error) {
      this.logger.error('Error adding submission', error);
      throw error;
    }
  }

  async updateSubmission(submission: Submission): Promise<void> {
    this.logger.info('Updating submission', submission);
    try {
      await this.apiService.createOrUpdateSubmission({
        id: submission.id,
        songId: submission.songId,
        username: submission.contributor,
        url: submission.url,
        firstSub: submission.firstSub,
        songWikiUpdated: submission.songWikiUpdated,
        userWikiUpdated: submission.userWikiUpdated,
        isPublic: submission.isPublic,
        isMulti: submission.isMulti,
        isFeatured: submission.isFeatured,
        isDownscroll: submission.isDownscroll,
        isAAAA: submission.isAAAA
      }).toPromise();

      this.loadSubmissions();
      this.submissionUpdatesSubject.next();
    } catch (error) {
      this.logger.error('Error updating submission', error);
      throw error;
    }
  }

  async deleteSubmission(submission: Submission): Promise<void> {
    this.logger.info('Deleting submission', submission);
    try {
      await this.apiService.deleteSubmission(
        submission.songId.toString(),
        submission.contributor
      ).toPromise();

      this.loadSubmissions();
      this.submissionUpdatesSubject.next();
    } catch (error) {
      this.logger.error('Error deleting submission', error);
      throw error;
    }
  }
}