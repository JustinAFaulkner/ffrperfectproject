import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WikiUpdateService } from '../../services/wiki-update.service';
import { SubmissionService } from '../../services/submission.service';
import { SongService } from '../../services/song.service';
import { LoggingService } from '../../services/logging.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { WikiUpdateGroup } from '../../models/wiki-update-group.interface';
import { WikiTextModalComponent } from './wiki-text-modal.component';
import { Song } from '../../models/song.interface';
import { AccessDeniedComponent } from '../shared/access-denied.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wiki-updates',
  standalone: true,
  imports: [CommonModule, FormsModule, WikiTextModalComponent, AccessDeniedComponent],
  template: `
  <ng-container *ngIf="isLoggedIn$ | async; else accessDenied">
    <div class="container">
      <h1>{{ isUserWiki ? 'User' : 'Song' }} Wiki Updates Remaining</h1>
      
      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterGroups()"
          placeholder="Search {{ isUserWiki ? 'contributors or songs' : 'songs or contributors' }}..."
          class="search-input"
        />
      </div>

      <div class="updates-list">
        <div 
          *ngFor="let group of filteredGroups$ | async" 
          class="update-group">
          <div class="group-header">
            <h3>{{ group.key }}</h3>
            <div class="header-actions">
              <button class="wiki-text-btn" (click)="showWikiText(group)">
                <i class="fas fa-code"></i>
                Wiki Text
              </button>
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  [checked]="false"
                  (change)="toggleGroupUpdate(group)"
                />
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
          <div class="group-items">
            <p *ngFor="let item of group.items" class="item-title">
              {{ item.title }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <app-wiki-text-modal
      *ngIf="showModal"
      [isUserWiki]="isUserWiki"
      [group]="selectedGroup!"
      (close)="hideWikiText()">
    </app-wiki-text-modal>
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
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
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

    .updates-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .update-group {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    :host-context(body.dark-mode) .update-group {
      background: #2d2d2d;
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(0,0,0,0.02);
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    :host-context(body.dark-mode) .group-header {
      background: rgba(255,255,255,0.02);
      border-bottom-color: rgba(255,255,255,0.05);
    }

    .group-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
    }

    :host-context(body.dark-mode) .group-header h3 {
      color: #e0e0e0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .wiki-text-btn {
      padding: 0.5rem 1rem;
      background: #28aad1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .wiki-text-btn:hover {
      background: #2391b2;
    }

    .group-items {
      padding: 1rem;
    }

    .item-title {
      margin: 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .item-title {
      color: #999;
    }

    .checkbox-container {
      position: relative;
      padding-left: 35px;
      cursor: pointer;
      user-select: none;
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
      top: -12px;
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
  `]
})
export class WikiUpdatesComponent implements OnInit, OnDestroy {
  isLoggedIn$ = this.authService.isLoggedIn();
  isUserWiki: boolean = false;
  searchTerm: string = '';
  private groupsSubject = new BehaviorSubject<WikiUpdateGroup[]>([]);
  filteredGroups$ = this.groupsSubject.asObservable();
  private subscription: Subscription = new Subscription();
  showModal = false;
  selectedGroup: WikiUpdateGroup | null = null;
  
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private wikiUpdateService: WikiUpdateService,
    private submissionService: SubmissionService,
    private songService: SongService,
    private logger: LoggingService
  ) {}

  ngOnInit() {
    this.isUserWiki = this.route.snapshot.data['type'] === 'user';
    this.logger.info('Wiki Updates Component initialized', {
      type: this.isUserWiki ? 'user' : 'song'
    });
    this.loadGroups();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadGroups() {
    this.logger.info('Loading groups');
    
    this.songService.getSongs().subscribe(songs => {
      this.logger.info(`Loaded ${songs.length} songs`);
      
      this.submissionService.getAllSubmissions().subscribe(submissions => {
        this.logger.info(`Processing ${submissions.length} submissions`);
        
        // Create a map for quick song lookups
        const songMap = new Map<string, Song>();
        songs.forEach(song => songMap.set(song.id.toString(), song));
        
        // Group submissions that need updates
        const groupMap = new Map<string, WikiUpdateGroup>();
        let needsUpdateCount = 0;

        submissions.forEach(submission => {
          const song = songMap.get(submission.songId.toString());
          if (!song) {
            this.logger.warn(`Song not found for submission`, { 
              songId: submission.songId, 
              contributor: submission.contributor 
            });
            return;
          }

          const needsUpdate = this.isUserWiki ? 
            !submission.userWikiUpdated : 
            !submission.songWikiUpdated;

          if (needsUpdate) {
            needsUpdateCount++;
            const key = this.isUserWiki ? submission.contributor : song.title;
            
            if (!groupMap.has(key)) {
              groupMap.set(key, {
                key,
                items: []
              });
            }

            const group = groupMap.get(key)!;
            group.items.push({
              submissionId: submission.id,
              songId: song.id,
              title: this.isUserWiki ? song.title : submission.contributor
            });
          }
        });

        const groups = Array.from(groupMap.values())
          .sort((a, b) => a.key.localeCompare(b.key));

        this.logger.info('Groups processed', {
          totalGroups: groups.length,
          totalItemsNeedingUpdate: needsUpdateCount,
          type: this.isUserWiki ? 'user' : 'song'
        });

        this.groupsSubject.next(groups);
        this.filterGroups();
      });
    });
  }

  filterGroups() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredGroups$ = this.groupsSubject.pipe(
      map(groups => {
        const filtered = groups.filter(group => 
          group.key.toLowerCase().includes(searchLower) ||
          group.items.some(item => item.title.toLowerCase().includes(searchLower))
        );
        
        this.logger.info('Groups filtered', {
          originalCount: groups.length,
          filteredCount: filtered.length,
          searchTerm: this.searchTerm
        });
        
        return filtered;
      })
    );
  }

  async toggleGroupUpdate(group: WikiUpdateGroup) {
    this.logger.info('Toggling group update', {
      key: group.key,
      itemCount: group.items.length
    });
    
    try {
      for (const item of group.items) {
        await this.wikiUpdateService.toggleWikiStatus(
          item.submissionId,
          this.isUserWiki ? 'user' : 'song'
        );
      }
      
      const currentGroups = this.groupsSubject.value;
      const updatedGroups = currentGroups.filter(g => g.key !== group.key);
      this.groupsSubject.next(updatedGroups);
      
      this.logger.info('Group update completed', {
        key: group.key,
        remainingGroups: updatedGroups.length
      });
    } catch (error) {
      this.logger.error('Error updating wiki status for group', {
        key: group.key,
        error
      });
    }
  }

  showWikiText(group: WikiUpdateGroup) {
    this.selectedGroup = group;
    this.showModal = true;
  }
  
  hideWikiText() {
    this.showModal = false;
    this.selectedGroup = null;
  }
}