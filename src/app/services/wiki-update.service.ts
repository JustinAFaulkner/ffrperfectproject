import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { SubmissionService } from './submission.service';

@Injectable({
  providedIn: 'root'
})
export class WikiUpdateService {
  private readonly submissionsCollection = 'submissions';

  constructor(
    private firestore: Firestore,
    private submissionService: SubmissionService
  ) {}

  async toggleWikiStatus(submissionId: string, type: 'user' | 'song'): Promise<void> {
    try {
      const submissionRef = doc(this.firestore, this.submissionsCollection, submissionId);
      const updateField = type === 'user' ? 'userWikiUpdated' : 'songWikiUpdated';
      
      // Update Firestore
      await updateDoc(submissionRef, {
        [updateField]: true
      });

      // Update in-memory cache through SubmissionService
      await this.submissionService.updateWikiStatus(submissionId, type);
    } catch (error) {
      console.error('Error updating wiki status:', error);
      throw error;
    }
  }
}