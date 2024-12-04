import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Submission } from '../models/submission.interface';
import { UrlTransformerService } from './url-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private readonly submissionsCollection = 'submissions';
  private submissionsCache$ = new ReplaySubject<Record<string, Submission[]>>(1);
  private initialized = false;
  
  // New subject to notify of submission updates
  private submissionUpdatesSubject = new Subject<void>();
  public submissionUpdates$ = this.submissionUpdatesSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private urlTransformer: UrlTransformerService
  ) {}

  private async initialize() {
    if (this.initialized) return;

    const submissionsRef = collection(this.firestore, this.submissionsCollection);
    const submissionsQuery = query(submissionsRef);
    const snapshot = await getDocs(submissionsQuery);

    const submissionMap: Record<string, Submission[]> = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const songId = data['songId'].toString();
      if (!submissionMap[songId]) {
        submissionMap[songId] = [];
      }
      submissionMap[songId].push({
        id: doc.id,
        songId: data['songId'] as number,
        youtubeUrl: this.urlTransformer.transformYoutubeUrl(data['url'] as string),
        contributor: data['contributor'] as string,
        songWikiUpdated: data['songWikiUpdated'] as boolean,
        userWikiUpdated: data['userWikiUpdated'] as boolean,
      });
    });

    this.submissionsCache$.next(submissionMap);
    this.initialized = true;
  }

  getAllSubmissions(): Observable<Record<string, Submission[]>> {
    if (!this.initialized) {
      this.initialize();
    }
    return this.submissionsCache$.pipe(take(1));
  }

  async updateWikiStatus(submissionId: string, type: 'user' | 'song'): Promise<void> {
    try {
      const submissionRef = doc(this.firestore, this.submissionsCollection, submissionId);
      const updateField = type === 'user' ? 'userWikiUpdated' : 'songWikiUpdated';

      // Update Firestore
      await updateDoc(submissionRef, {
        [updateField]: true
      });

      // Update cache
      const currentMap = await firstValueFrom(this.submissionsCache$);
      const updatedMap = { ...currentMap };
      
      // Find and update the submission in the cache
      for (const songId in updatedMap) {
        const submissions = updatedMap[songId];
        const submissionIndex = submissions.findIndex((s: Submission) => s.id === submissionId);
        
        if (submissionIndex !== -1) {
          // Create a new submission object with the updated status
          const updatedSubmission = {
            ...submissions[submissionIndex],
            [type === 'user' ? 'userWikiUpdated' : 'songWikiUpdated']: true
          };
          
          // Update the submission in the array
          updatedMap[songId] = [
            ...submissions.slice(0, submissionIndex),
            updatedSubmission,
            ...submissions.slice(submissionIndex + 1)
          ];
          
          // Update the cache
          this.submissionsCache$.next(updatedMap);
          
          // Notify subscribers of the update
          this.submissionUpdatesSubject.next();
          break;
        }
      }
    } catch (error) {
      console.error('Error updating wiki status:', error);
      throw error;
    }
  }

  async addSubmission(songId: string, submission: Submission): Promise<void> {
    try {
      const submissionsRef = collection(this.firestore, this.submissionsCollection);

      // Prepare the data for Firestore
      const submissionData = {
        songId: Number(songId),
        url: submission.youtubeUrl,
        contributor: submission.contributor,
        songWikiUpdated: submission.songWikiUpdated,
        userWikiUpdated: submission.userWikiUpdated,
      };

      // Add to Firestore
      const docRef = await addDoc(submissionsRef, submissionData);

      // Update the submission with the new ID
      submission.id = docRef.id;

      // Update cache
      this.submissionsCache$.pipe(take(1)).subscribe((currentMap) => {
        const updatedMap = { ...currentMap };
        if (!updatedMap[songId]) {
          updatedMap[songId] = [];
        }
        updatedMap[songId] = [...updatedMap[songId], submission];
        this.submissionsCache$.next(updatedMap);
        this.submissionUpdatesSubject.next();
      });
    } catch (error) {
      console.error('Error adding submission:', error);
      throw error;
    }
  }

  async updateSubmission(submission: Submission): Promise<void> {
    try {
      const submissionRef = doc(
        this.firestore,
        this.submissionsCollection,
        submission.id
      );

      // Prepare the data for Firestore
      const submissionData = {
        songId: submission.songId,
        url: submission.youtubeUrl,
        contributor: submission.contributor,
        songWikiUpdated: submission.songWikiUpdated,
        userWikiUpdated: submission.userWikiUpdated,
      };

      // Update in Firestore
      await updateDoc(submissionRef, submissionData);

      // Update cache
      this.submissionsCache$.pipe(take(1)).subscribe((currentMap) => {
        const songId = submission.songId.toString();
        const updatedMap = { ...currentMap };
        if (updatedMap[songId]) {
          const index = updatedMap[songId].findIndex(
            (s) => s.id === submission.id
          );
          if (index !== -1) {
            updatedMap[songId][index] = submission;
            this.submissionsCache$.next(updatedMap);
            this.submissionUpdatesSubject.next();
          }
        }
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      throw error;
    }
  }

  async deleteSubmission(submission: Submission): Promise<void> {
    try {
      const submissionRef = doc(
        this.firestore,
        this.submissionsCollection,
        submission.id
      );

      // Delete from Firestore
      await deleteDoc(submissionRef);

      // Update cache
      this.submissionsCache$.pipe(take(1)).subscribe((currentMap) => {
        const songId = submission.songId.toString();
        const updatedMap = { ...currentMap };
        if (updatedMap[songId]) {
          updatedMap[songId] = updatedMap[songId].filter(
            (s) => s.id !== submission.id
          );
          this.submissionsCache$.next(updatedMap);
          this.submissionUpdatesSubject.next();
        }
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  }
}