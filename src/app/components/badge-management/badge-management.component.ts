import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import { ContributorBadges, BadgeKey } from '../../models/user-badges.interface';
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
        <label class="switch">
          <input
            type="checkbox"
            [(ngModel)]="showOwedOnly"
            (change)="filterContributors()"
          />
          <span class="slider"></span>
          <span class="switch-label">Show Owed Badges Only</span>
        </label>
      </div>

      <div class="contributors-list">
        <div 
          *ngFor="let contributor of filteredContributors$ | async" 
          class="contributor-item">
          <div class="contributor-info">
            <span class="contributor-name">{{ contributor.username }}</span>
            <span class="submission-count">
              {{ contributor.submissionCount }} submissions 
              <span class="first-count">({{ contributor.firstCount }} firsts)</span>
            </span>
          </div>
          <div class="badge-section">
            <span class="badge-label">Badges:</span>
            <div class="badge-controls">
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge1"
                  (change)="toggleBadge(contributor.username, 'badge_one', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">1</span>
              </label>
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge2"
                  (change)="toggleBadge(contributor.username, 'badge_two', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">2</span>
              </label>
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge3"
                  (change)="toggleBadge(contributor.username, 'badge_three', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">3</span>
              </label>
            </div>
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
      margin-bottom: 20px;
      display: flex;
      gap: 15px;
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

    .first-count {
      color: #28aad1;
    }

    :host-context(body.dark-mode) .first-count {
      color: #3dbde4;
    }

    .badge-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .badge-label {
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .badge-label {
      color: #999;
    }

    .badge-controls {
      display: flex;
      gap: 1rem;
    }

    .checkbox-container {
      position: relative;
      padding-left: 35px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
    }

    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      left: 0;
      height: 25px;
      width: 25px;
      background-color: #eee;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    :host-context(body.dark-mode) .checkmark {
      background-color: #444;
    }

    .checkbox-container:hover input ~ .checkmark {
      background-color: #ccc;
    }

    :host-context(body.dark-mode) .checkbox-container:hover input ~ .checkmark {
      background-color: #555;
    }

    .checkbox-container input:checked ~ .checkmark {
      background-color: #48bb78;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }

    .checkbox-container .checkmark:after {
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }

    .badge-number {
      margin-left: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .badge-number {
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
        width: 100%;
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
          filtered = filtered;
        }

        return filtered;
      })
    );
  }

  async toggleBadge(
    username: string, 
    badgeKey: BadgeKey, 
    event: Event
  ) {
    const checkbox = event.target as HTMLInputElement;
    try {
      await this.badgeService.updateBadge(username, badgeKey, checkbox.checked);
      this.loadContributors();
    } catch (error) {
      console.error('Error updating badge:', error);
      checkbox.checked = !checkbox.checked;
    }
  }
}