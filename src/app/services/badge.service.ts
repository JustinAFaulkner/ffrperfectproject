import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserBadges, ContributorBadges } from '../models/user-badges.interface';
import { LeaderboardService } from './leaderboard.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly usersCollection = 'users';

  constructor(
    private firestore: Firestore,
    private leaderboardService: LeaderboardService
  ) {}

  getContributorBadges(): Observable<ContributorBadges[]> {
    return this.leaderboardService.getContributorStats().pipe(
      switchMap(contributors => {
        // Get all user badges in a single batch
        return from(this.fetchAllUserBadges()).pipe(
          map(badgesMap => {
            return contributors.map(contributor => ({
              username: contributor.name,
              submissionCount: contributor.count,
              firstCount: contributor.firstCount,
              badges: badgesMap[contributor.name] || {
                badge1: false,
                badge2: false,
                badge3: false
              }
            }));
          })
        );
      })
    );
  }

  private async fetchAllUserBadges(): Promise<Record<string, UserBadges>> {
    try {
      const usersRef = collection(this.firestore, this.usersCollection);
      const snapshot = await getDocs(usersRef);
      
      const badgesMap: Record<string, UserBadges> = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        badgesMap[doc.id] = {
          badge1: data['badge1'] || false,
          badge2: data['badge2'] || false,
          badge3: data['badge3'] || false
        };
      });
      
      return badgesMap;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return {};
    }
  }

  async updateBadge(
    username: string, 
    badgeKey: keyof UserBadges, 
    value: boolean
  ): Promise<void> {
    try {
      const userRef = doc(this.firestore, this.usersCollection, username);
      const docSnap = await getDoc(userRef);
      
      const currentBadges: UserBadges = docSnap.exists() 
        ? {
            badge1: docSnap.data()['badge1'] || false,
            badge2: docSnap.data()['badge2'] || false,
            badge3: docSnap.data()['badge3'] || false
          }
        : { badge1: false, badge2: false, badge3: false };

      await setDoc(userRef, {
        ...currentBadges,
        [badgeKey]: value
      }, { merge: true });
    } catch (error) {
      console.error('Error updating badge:', error);
      throw error;
    }
  }
}