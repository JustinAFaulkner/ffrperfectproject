import { Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class WikiUpdateService {
  constructor(
    private submissionService: SubmissionService,
    private logger: LoggingService
  ) {}

  async toggleWikiStatus(submissionId: string, type: 'user' | 'song'): Promise<void> {
    this.logger.info('Toggling wiki status', { submissionId, type });
    try {
      await this.submissionService.updateWikiStatus(submissionId, type);
      this.logger.info('Wiki status updated successfully', { submissionId, type });
    } catch (error) {
      this.logger.error('Error updating wiki status', { submissionId, type, error });
      throw error;
    }
  }
}