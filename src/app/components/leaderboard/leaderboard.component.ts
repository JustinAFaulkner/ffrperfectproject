import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaderboardService } from '../../services/leaderboard.service';
import { ContributorStats } from '../../models/contributor-stats.interface';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="leaderboard-container">
      <div class="filters">
        <input
          type="text"
          [(ngModel)]="nameFilter"
          (input)="applyFilters()"
          placeholder="Search contributors..."
          class="search-input"
        />
        <div class="min-contributions">
          <label>
            Minimum Contributions:
            <input
              type="number"
              [(ngModel)]="minContributions"
              (input)="applyFilters()"
              min="0"
              class="number-input"
            />
          </label>
        </div>
      </div>

      <div class="contributors-list">
        <div 
          *ngFor="let contributor of filteredContributors" 
          class="contributor-card"
          [class.gold]="contributor.rank === 1"
          [class.silver]="contributor.rank === 2"
          [class.bronze]="contributor.rank === 3">
          <div class="rank">{{contributor.rank}}</div>
          <div class="contributor-info">
            <span class="name">{{contributor.name}}</span>
            <span class="count">{{contributor.count}} submissions</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leaderboard-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .filters {
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .search-input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .number-input {
      width: 80px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .contributors-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .contributor-card {
      display: flex;
      align-items: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .contributor-card:hover {
      transform: translateX(5px);
    }

    .contributor-card.gold {
      background: linear-gradient(135deg, white, #ffd700 150%);
    }

    .contributor-card.silver {
      background: linear-gradient(135deg, white, #c0c0c0 150%);
    }

    .contributor-card.bronze {
      background: linear-gradient(135deg, white, #cd7f32 150%);
    }

    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      width: 40px;
      text-align: center;
      color: #666;
    }

    .contributor-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .name {
      font-weight: 500;
      color: #333;
    }

    .count {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .contributor-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  contributors: ContributorStats[] = [];
  filteredContributors: ContributorStats[] = [];
  nameFilter: string = '';
  minContributions: number = 0;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getContributorStats().subscribe(stats => {
      this.contributors = stats;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredContributors = this.contributors.filter(contributor => {
      const matchesName = contributor.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());
      const matchesMin = contributor.count >= this.minContributions;
      return matchesName && matchesMin;
    });
  }
}