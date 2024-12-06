import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import { ContributorBadges, UserBadges } from '../../models/user-badges.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-badge-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Badge Management</h1>
      
      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterContributors()"
          placeholder="Search contributors..."
          class="search-input"
        />
        <label class="toggle-filter">
          <input
            type="checkbox"
            [(ngModel)]="showOwedOnly"
            (change)="filterContributors()"
          />
          Show Owed Badges Only
        </label>
      </div>

      <div class="contributors-list">
        <div *ngFor="let contributor of filteredContributors$ | async" class="contributor-item">
          <div class="contributor-info">
            <span class="contributor-name">{{ contributor.username }}</span>
            <span class="submission-count">{{ contributor.submissionCount }} submissions</span>
          </div>
          <div class="badge-controls">
            <label class="badge-checkbox">
              <input
                type="checkbox"
                [checked]="contributor.badges.badge1"
                (change)="toggleBadge(contributor.username, 'badge1', $event)"
              />
              Badge 1
            </label>
            <label class="badge-checkbox">
              <input
                type="checkbox"
                [checked]="contributor.badges.badge2"
                (change)="toggleBadge(contributor.username, 'badge2', $event)"
              />
              Badge 2
            </label>
            <label class="badge-checkbox">
              <input
                type="checkbox"
                [checked]="contributor.badges.badge3"
                (change)="toggleBadge(contributor.username, 'badge3', $event)"
              />
              Badge 3
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    :host-context(body.dark-mode) h1 {
      color: #e0e0e0;
    }

    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    :host-context(body.dark-mode) .search-input {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .toggle-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      cursor: pointer;
    }

    :host-context(body.dark-mode) .toggle-filter {
      color: #999;
    }

    .contributors-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contributor-item {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .contributor-item {
      background: #2d2d2d;
    }

    .contributor-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .contributor-name {
      font-weight: 500;
      color: #333;
    }

    :host-context(body.dark-mode) .contributor-name {
      color: #e0e0e0;
    }

    .submission-count {
      font-size: 0.9rem;
      color: #666;
    }

    :host-context(body.dark-mode) .submission-count {
      color: #999;
    }

    .badge-controls {
      display: flex;
      gap: 1rem;
    }

    .badge-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      cursor: pointer;
    }

    :host-context(body.dark-mode) .badge-checkbox {
      color: #999;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .contributor-item {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .badge-controls {
        justify-content: space-between;
      }
    }
  `]
})
export class BadgeManagementComponent implements OnInit {
  private contributorsSubject = new BehaviorSubject<ContributorBadges[]>([]);
  filteredContributors$ = this.contributorsSubject.asObservable();
  searchTerm = '';
  showOwedOnly = false;

  constructor(private badgeService: BadgeService) {}

  ngOnInit() {
    this.loadContributors();
  }

  private loadContributors() {
    this.badgeService.getContributorBadges().subscribe(contributors => {
      this.contributorsSubject.next(contributors);
      this.filterContributors();
    });
  }

  filterContributors() {
    this.filteredContributors$ = this.contributorsSubject.pipe(
      map(contributors => {
        let filtered = contributors;

        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(c => 
            c.username.toLowerCase().includes(searchLower)
          );
        }

        if (this.showOwedOnly) {
          // Implementation of "owed badges" logic will go here
          // For now, just return all contributors
          filtered = filtered;
        }

        return filtered;
      })
    );
  }

  async toggleBadge(
    username: string, 
    badgeKey: keyof UserBadges, 
    event: Event
  ) {
    const checkbox = event.target as HTMLInputElement;
    try {
      await this.badgeService.updateBadge(username, badgeKey, checkbox.checked);
      this.loadContributors(); // Refresh the list
    } catch (error) {
      console.error('Error updating badge:', error);
      checkbox.checked = !checkbox.checked; // Revert the checkbox state
    }
  }
}