import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
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
          map(users => {
            return contributors.map(contributor => {
              const userBadges = users.find(u => u.username === contributor.name);
              return {
                username: contributor.name,
                submissionCount: contributor.count,
                firstCount: contributor.firstCount,
                badges: {
                  badge1: userBadges?.badge_one || false,
                  badge2: userBadges?.badge_two || false,
                  badge3: userBadges?.badge_three || false
                }
              };
            });
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
    const currentBadges = await firstValueFrom(this.apiService.getUser(username)) || {
      badge_one: false,
      badge_two: false,
      badge_three: false
    };

    // Map component badge keys to API badge keys
    const badgeMapping: Record<BadgeKey, keyof UserBadges> = {
      'badge_one': 'badge_one',
      'badge_two': 'badge_two', 
      'badge_three': 'badge_three'
    };

    await firstValueFrom(this.apiService.updateUser(username, {
      ...currentBadges,
      [badgeMapping[badgeKey]]: value
    }));
  }
}