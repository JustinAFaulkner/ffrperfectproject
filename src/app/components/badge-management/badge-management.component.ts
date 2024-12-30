import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import { ContributorBadges, BadgeKey } from '../../models/user-badges.interface';
import { SongService } from '../../services/song.service';
import { AccessDeniedComponent } from '../shared/access-denied.component';
import { AuthService } from '../../services/auth.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';

@Component({
  selector: 'app-badge-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AccessDeniedComponent],
  template: `
  <ng-container *ngIf="isLoggedIn$ | async; else accessDenied">
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
          <span class="switch-label">Owed Badges Only</span>
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
              <span class="first-count">({{ contributor.firstCount }} 1sts)</span>
            </span>
          </div>
          <div class="badge-section">
            <div class="badge-controls">
              <label class="checkbox-container" [class.disabled]="!(canEarnBadge(contributor, 1) | async)">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge1"
                  [disabled]="!(canEarnBadge(contributor, 1) | async)"
                  (change)="toggleBadge(contributor.username, 'badge_one', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">Out Walkin'</span>
              </label>

              <label class="checkbox-container" [class.disabled]="!(canEarnBadge(contributor, 2) | async)">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge2"
                  [disabled]="!(canEarnBadge(contributor, 2) | async)"
                  (change)="toggleBadge(contributor.username, 'badge_two', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">Budding Pioneer</span>
              </label>

              <label class="checkbox-container" [class.disabled]="!(canEarnBadge(contributor, 3) | async)">
                <input
                  type="checkbox"
                  [checked]="contributor.badges.badge3"
                  [disabled]="!(canEarnBadge(contributor, 3) | async)"
                  (change)="toggleBadge(contributor.username, 'badge_three', $event)"
                />
                <span class="checkmark"></span>
                <span class="badge-number">In A Pickle</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ng-container>
  <ng-template #accessDenied>
    <app-access-denied></app-access-denied>
  </ng-template>
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

    .checkbox-container:hover:not(.disabled) input ~ .checkmark {
      background-color: #ccc;
    }

    :host-context(body.dark-mode) .checkbox-container:hover:not(.disabled) input ~ .checkmark {
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

    .checkbox-container.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .checkbox-container.disabled input {
      cursor: not-allowed;
    }

    .checkbox-container.disabled .checkmark {
      cursor: not-allowed;
    }

    .badge-number {
      margin-right: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .badge-number {
      color: #999;
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
  isLoggedIn$ = this.authService.isLoggedIn();
  private contributorsSubject = new BehaviorSubject<ContributorBadges[]>([]);
  filteredContributors$: Observable<ContributorBadges[]>;
  searchTerm = '';
  showOwedOnly = true;

  constructor(
    private authService: AuthService,
    private badgeService: BadgeService,
    private songService: SongService
  ) {
    this.filteredContributors$ = this.contributorsSubject.asObservable();
  }

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
    this.filteredContributors$ = this.contributorsSubject.asObservable().pipe(
      switchMap((contributors: ContributorBadges[]): Observable<ContributorBadges[]> => {
        if (!this.showOwedOnly) {
          return new Observable<ContributorBadges[]>(observer => {
            observer.next(this.filterBySearch(contributors));
            observer.complete();
          });
        }

        return this.songService.getSongs().pipe(
          map(songs => {
            const filtered = contributors.filter(contributor => {
              const userSongs = songs.filter(song => 
                song.submissions.some(sub => sub.contributor === contributor.username)
              );

              const needsBadge1 = !contributor.badges.badge1 && userSongs.length >= 5;
              const needsBadge2 = !contributor.badges.badge2 && 
                userSongs.some(song => 
                  song.submissions.some(sub => 
                    sub.contributor === contributor.username && sub.firstSub
                  )
                );
              const needsBadge3 = !contributor.badges.badge3 && 
                userSongs.filter(song => song.difficulty > 29).length >= 5;

              return needsBadge1 || needsBadge2 || needsBadge3;
            });

            return this.filterBySearch(filtered);
          })
        );
      })
    );
  }
  
  private filterBySearch(contributors: ContributorBadges[]): ContributorBadges[] {
    if (!this.searchTerm) {
      return this.sortContributors(contributors);
    }
  
    const searchLower = this.searchTerm.toLowerCase();
    return this.sortContributors(
      contributors.filter(c => 
        c.username.toLowerCase().includes(searchLower)
      )
    );
  }
  
  private sortContributors(contributors: ContributorBadges[]): ContributorBadges[] {
    return contributors.sort((a, b) => b.submissionCount - a.submissionCount);
  }

  canEarnBadge(contributor: ContributorBadges, badgeNumber: number): Observable<boolean> {
    return this.songService.getSongs().pipe(
      map((songs: SongWithSubmissions[]) => {
        const userSongs = songs.filter(song => 
          song.submissions.some(sub => sub.contributor === contributor.username)
        );

        switch(badgeNumber) {
          case 1: // Out Walkin'
            return userSongs.length >= 5;
          case 2: // Budding Pioneer
            return userSongs.some(song => 
              song.submissions.some(sub => 
                sub.contributor === contributor.username && sub.firstSub
              )
            );
          case 3: // In A Pickle
            return userSongs.filter(song => song.difficulty > 29).length >= 5;
          default:
            return false;
        }
      })
    );
  }

  async toggleBadge(
    username: string, 
    badgeKey: BadgeKey, 
    event: Event
  ) {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;
    
    try {
      await this.badgeService.updateBadge(username, badgeKey, checked);
      this.loadContributors();
    } catch (error) {
      console.error('Error updating badge:', error);
      checkbox.checked = !checked;
    }
  }
}