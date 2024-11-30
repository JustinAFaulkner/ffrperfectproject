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
        
        // Count submissions per contributor
        const contributorCounts = allSubmissions.reduce((acc, submission) => {
          const contributor = submission.contributor;
          acc[contributor] = (acc[contributor] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Convert to array and sort by count
        const stats = Object.entries(contributorCounts)
          .map(([name, count]) => ({ name, count, rank: 0 }))
          .sort((a, b) => b.count - a.count);

        // Assign ranks (handling ties)
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

        return stats;
      })
    );
  }
}