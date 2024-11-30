import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  getDocs,
  query
} from '@angular/fire/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Submission } from '../models/submission.interface';
import { UrlTransformerService } from './url-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private readonly submissionsCollection = 'submissions';
  private submissionsCache$ = new ReplaySubject<Record<string, Submission[]>>(1);
  private initialized = false;

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
    snapshot.docs.forEach(doc => {
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

  addSubmission(songId: string, submission: Submission): void {
    this.submissionsCache$.pipe(take(1)).subscribe(currentMap => {
      const updatedMap = { ...currentMap };
      if (!updatedMap[songId]) {
        updatedMap[songId] = [];
      }
      updatedMap[songId] = [...updatedMap[songId], submission];
      this.submissionsCache$.next(updatedMap);
    });
  }
}