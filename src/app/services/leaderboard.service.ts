import { Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContributorStats } from '../models/contributor-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  constructor(private submissionService: SubmissionService) {}

  getContributorStats(): Observable<ContributorStats[]> {
    return this.submissionService.getAllSubmissions().pipe(
      map(submissionMap => {
        // Flatten all submissions into a single array
        const allSubmissions = Object.values(submissionMap).flat();
        
        // Count submissions and first submissions per contributor
        const contributorCounts = allSubmissions.reduce((acc, submission) => {
          const contributor = submission.contributor;
          if (!acc[contributor]) {
            acc[contributor] = { total: 0, firsts: 0 };
          }
          acc[contributor].total++;
          if (submission.firstSub) {
            acc[contributor].firsts++;
          }
          return acc;
        }, {} as Record<string, { total: number; firsts: number }>);

        // Convert to array and prepare for ranking
        const stats = Object.entries(contributorCounts)
          .map(([name, counts]) => ({
            name,
            count: counts.total,
            firstCount: counts.firsts,
            rank: 0,
            firstRank: 0
          }));

        // Sort and assign total submission ranks
        stats.sort((a, b) => b.count - a.count);
        let currentRank = 1;
        let currentCount = -1;
        let sameRankCount = 0;

        stats.forEach((stat, index) => {
          if (stat.count !== currentCount) {
            currentRank = index + 1 - sameRankCount;
            currentCount = stat.count;
            sameRankCount = 0;
          } else {
            sameRankCount++;
          }
          stat.rank = currentRank;
        });

        // Sort and assign first submission ranks
        stats.sort((a, b) => b.firstCount - a.firstCount);
        currentRank = 1;
        let currentFirstCount = -1;
        sameRankCount = 0;

        stats.forEach((stat, index) => {
          if (stat.firstCount !== currentFirstCount) {
            currentRank = index + 1 - sameRankCount;
            currentFirstCount = stat.firstCount;
            sameRankCount = 0;
          } else {
            sameRankCount++;
          }
          stat.firstRank = currentRank;
        });

        // Return to original total submission sort
        return stats.sort((a, b) => b.count - a.count);
      })
    );
  }
}