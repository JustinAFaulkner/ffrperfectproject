import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeaderboardService } from '../../services/leaderboard.service';
import { ContributorStats } from '../../models/contributor-stats.interface';
import { LeaderboardStateService, LeaderboardView } from '../../services/leaderboard-state.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="leaderboard-container">
      <div class="filters">
        <span class="leaderboard-title">
          <i class="title-icon fa-solid" 
             title="Achievements"
             [class.fa-file-arrow-up]="currentView === 'submissions'"
             [class.fa-ranking-star]="currentView === 'firsts'"
             [class.fa-award]="currentView === 'achievements'"></i> {{getViewTitle()}}
        </span>
        <div class="view-toggle">
          <button 
            [class.active]="currentView === 'submissions'"
            (click)="setView('submissions')"
            class="view-btn"
            title="Total Submissions">
            <i class="fa-solid fa-file-arrow-up"></i>
          </button>
          <button 
            [class.active]="currentView === 'firsts'"
            (click)="setView('firsts')"
            class="view-btn"
            title="First Submissions">
            <i class="fa-solid fa-ranking-star"></i>
          </button>
          <button 
            [class.active]="currentView === 'achievements'"
            (click)="setView('achievements')"
            class="view-btn"
            title="Achievements">
            <i class="fas fa-award"></i>
          </button>
        </div>
      </div>
      <div class="filters">
        <input
          type="text"
          [(ngModel)]="nameFilter"
          (input)="applyFilters()"
          placeholder="Search contributors..."
          class="search-input"
        />
        <div class="number-filters">
          <div class="min-contributions">
            <label>
              <i class="fa-solid fa-file-arrow-up filter-icon" title="Total Submissions"></i>
              <input
                type="number"
                [(ngModel)]="minContributions"
                (input)="applyFilters()"
                min="0"
                class="number-input"
              />
              to
              <input
                type="number"
                [(ngModel)]="maxContributions"
                (input)="applyFilters()"
                max="999"
                class="number-input"
              />
            </label>
          </div>
          <div class="min-contributions">
            <label>
              <i class="fas fa-award filter-icon" title="Achievements"></i>
              <input
                type="number"
                [(ngModel)]="minAchievements"
                (input)="applyFilters()"
                min="0"
                class="number-input"
              />
              to
              <input
                type="number"
                [(ngModel)]="maxAchievements"
                (input)="applyFilters()"
                max="30"
                class="number-input"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="contributors-list">
        <a 
          *ngFor="let contributor of filteredContributors" 
          class="contributor-card"
          [routerLink]="['/user', contributor.name]"
          [class.gold]="getRank(contributor) === 1"
          [class.silver]="getRank(contributor) === 2"
          [class.bronze]="getRank(contributor) === 3">
          <div class="rank">{{getRank(contributor)}}</div>
          <div class="contributor-info">
            <span class="name">{{contributor.name}}</span>
            <span class="count">
              <div class="stat-icons">
                <div class="stat-item" title="Total submissions">
                  <i class="fa-solid fa-file-arrow-up"></i>
                  <span>{{contributor.count}}</span>
                </div>
                <div class="stat-item" title="First submissions">
                  <i class="fa-solid fa-ranking-star"></i>
                  <span>{{contributor.firstCount}}</span>
                </div>
                <div class="stat-item" title="Achievements">
                  <i class="fa-solid fa-award"></i>
                  <span>{{contributor.achievementCount}}</span>
                </div>
              </div>
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

    .leaderboard-title {
      font-size: 1.75rem;
      color: #28aad1;
      font-weight: bold;
    }

    .filters {
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
      align-items: center;
      text-align: center;
    }

    .min-contributions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .min-contributions label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: #666;
    }

    :host-context(body.dark-mode) .filter-icon {
      color: #999;
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
      width: 45px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      -moz-appearance: textfield;
    }

    .number-input::-webkit-outer-spin-button,
    .number-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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

    :host-context(body.dark-mode) .slider {
      background-color: #333;
    }

    :host-context(body.dark-mode) .slider:before {
      background-color: #e0e0e0;
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
      color: #333;
    }

    :host-context(body.dark-mode) .contributor-card {
      background: #333;
      color: #e0e0e0;
    }

    .contributor-card:hover {
      transform: translateX(5px);
    }

    .contributor-card.gold {
      background: linear-gradient(135deg, white, #ffd700 150%);
      color: #333;
    }

    :host-context(body.dark-mode) .contributor-card.gold {
      background: linear-gradient(135deg, #333, #ffd700 150%);
      color: #e0e0e0;
    }

    .contributor-card.silver {
      background: linear-gradient(135deg, white, #c0c0c0 150%);
      color: #333;
    }

    :host-context(body.dark-mode) .contributor-card.silver {
      background: linear-gradient(135deg, #333, #c0c0c0 150%);
      color: #e0e0e0;
    }

    .contributor-card.bronze {
      background: linear-gradient(135deg, white, #cd7f32 150%);
      color: #333;
    }

    :host-context(body.dark-mode) .contributor-card.bronze {
      background: linear-gradient(135deg, #333, #cd7f32 150%);
      color: #e0e0e0;
    }

    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      width: 40px;
      text-align: center;
    }

    .contributor-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .name {
      font-weight: 500;
    }

    .count {
      font-size: 0.9rem;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
      margin-left: auto;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      background: #f0f0f0;
      color: #666;
      transition: all 0.2s;
    }

    :host-context(body.dark-mode) .view-btn {
      background: #333;
      color: #999;
    }

    .view-btn.active {
      background: #28aad1;
      color: white;
    }

    :host-context(body.dark-mode) .view-btn.active {
      background: #28aad1;
      color: white;
    }

    .view-btn:hover:not(.active) {
      background: #e0e0e0;
    }

    :host-context(body.dark-mode) .view-btn:hover:not(.active) {
      background: #444;
    }

    .stat-icons {
      display: flex;
      gap: 1rem;
      align-items: center;
      background-color: #eeeeee70;
      padding: 1rem 1.5rem;
      border-radius: 4px;
    }

    :host-context(body.dark-mode) .stat-icons {
      background-color: #1a1a1a70;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #333;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .stat-item {
      color: #e0e0e0;
    }

    .stat-item i {
      font-size: 1rem;
    }

    .stat-item i {
      color: #28aad1;
    }

    .number-filters {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .view-toggle {
        width: 100%;
        justify-content: space-between;
      }

      .view-btn {
        flex: 1;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .stat-icons {
        padding: 0.4rem;
      }

      .stat-item {
        font-size: 0.8rem;
      }

      .stat-item i {
        font-size: 0.9rem;
      }

      .contributor-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }

    @media (max-width: 389px) {
      .number-filters {
        flex-direction: column;
      }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  contributors: ContributorStats[] = [];
  filteredContributors: ContributorStats[] = [];
  nameFilter: string = '';
  minContributions: number = 0;
  maxContributions: number = 999;
  minAchievements: number = 0;
  maxAchievements: number = 30;
  currentView: LeaderboardView = 'submissions';

  constructor(
    private leaderboardService: LeaderboardService,
    private leaderboardState: LeaderboardStateService
  ) {
    this.currentView = this.leaderboardState.getCurrentView();
  }

  ngOnInit() {
    this.leaderboardService.getContributorStats().subscribe((stats) => {
      this.contributors = stats;
      this.applyFilters();
    });
  }

  setView(view: LeaderboardView) {
    this.currentView = view;
    this.leaderboardState.setView(view);
    this.applyFilters();
  }

  getRank(contributor: ContributorStats): number {
    switch (this.currentView) {
      case 'submissions':
        return contributor.rank;
      case 'firsts':
        return contributor.firstRank;
      case 'achievements':
        return contributor.achievementRank;
    }
  }

  getViewTitle(): string {
    switch (this.currentView) {
      case 'submissions':
        return 'Top Total Submissions';
      case 'firsts':
        return 'Top First Submissions';
      case 'achievements':
        return 'Top Achievements';
    }
  }

  applyFilters() {
    this.filteredContributors = this.contributors.filter((contributor) => {
      const matchesName = contributor.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());

      const withinSubmissions = (contributor.count >= this.minContributions && contributor.count <= this.maxContributions);
      
      const withinAchievements = (contributor.achievementCount >= this.minAchievements && contributor.achievementCount <= this.maxAchievements);

      return matchesName && withinSubmissions && withinAchievements;
    });

    // Sort based on current view
    this.filteredContributors.sort((a, b) => {
      switch (this.currentView) {
        case 'submissions':
          return b.count - a.count;
        case 'firsts':
          return b.firstCount - a.firstCount;
        case 'achievements':
          return b.achievementCount - a.achievementCount;
      }
    });
  }
}