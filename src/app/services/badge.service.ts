import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserBadges, ContributorBadges, BadgeKey } from '../models/user-badges.interface';
import { LeaderboardService } from './leaderboard.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  constructor(
    private apiService: ApiService,
    private leaderboardService: LeaderboardService
  ) {}

  getContributorBadges(): Observable<ContributorBadges[]> {
    return this.leaderboardService.getContributorStats().pipe(
      switchMap(contributors => {
        return this.apiService.getAllUsers().pipe(
          map(badgesMap => {
            return contributors.map(contributor => ({
              username: contributor.name,
              submissionCount: contributor.count,
              firstCount: contributor.firstCount,
              badges: {
                badge1: badgesMap[contributor.name]?.badge_one || false,
                badge2: badgesMap[contributor.name]?.badge_two || false,
                badge3: badgesMap[contributor.name]?.badge_three || false
              }
            }));
          })
        );
      })
    );
  }

  async updateBadge(
    username: string, 
    badgeKey: BadgeKey, 
    value: boolean
  ): Promise<void> {
    const currentBadges = await this.apiService.getUser(username).toPromise() || {
      badge_one: false,
      badge_two: false,
      badge_three: false
    };

    await this.apiService.updateUser(username, {
      ...currentBadges,
      [badgeKey]: value
    }).toPromise();
  }
}