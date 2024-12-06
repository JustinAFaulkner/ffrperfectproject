import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeaderboardService } from '../../services/leaderboard.service';
import { ContributorStats } from '../../models/contributor-stats.interface';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
        <label class="switch">
          <input
            type="checkbox"
            [(ngModel)]="showFirstsLeaderboard"
            (change)="applyFilters()"
          />
          <span class="slider"></span>
          <span class="switch-label">Show Firsts Leaderboard</span>
        </label>
      </div>

      <div class="contributors-list">
        <a 
          *ngFor="let contributor of filteredContributors" 
          class="contributor-card"
          [routerLink]="['/user', contributor.name]"
          [class.gold]="showFirstsLeaderboard ? contributor.firstRank === 1 : contributor.rank === 1"
          [class.silver]="showFirstsLeaderboard ? contributor.firstRank === 2 : contributor.rank === 2"
          [class.bronze]="showFirstsLeaderboard ? contributor.firstRank === 3 : contributor.rank === 3">
          <div class="rank">{{showFirstsLeaderboard ? contributor.firstRank : contributor.rank}}</div>
          <div class="contributor-info">
            <span class="name">{{contributor.name}}</span>
            <span class="count">
              {{contributor.count}} submissions
              <span class="first-count">({{contributor.firstCount}} firsts)</span>
            </span>
          </div>
        </a>
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

    :host-context(body.dark-mode) .search-input {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .number-input {
      width: 80px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    :host-context(body.dark-mode) .number-input {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    /* Toggle Switch Styles */
    .switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      position: relative;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
      background-color: #ccc;
      border-radius: 24px;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: .4s;
    }

    .switch input:checked + .slider {
      background-color: #28aad1;
    }

    .switch input:checked + .slider:before {
      transform: translateX(24px);
    }

    .switch-label {
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .switch-label {
      color: #999;
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
      text-decoration: none;
      color: inherit;
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

    .first-count {
      color: #28aad1;
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
  showFirstsLeaderboard: boolean = false;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getContributorStats().subscribe((stats) => {
      this.contributors = stats;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredContributors = this.contributors.filter((contributor) => {
      const matchesName = contributor.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());
      const matchesMin = contributor.count >= this.minContributions;
      return matchesName && matchesMin;
    });

    // Sort based on selected leaderboard type
    this.filteredContributors.sort((a, b) => {
      if (this.showFirstsLeaderboard) {
        return b.firstCount - a.firstCount;
      }
      return b.count - a.count;
    });
  }
}