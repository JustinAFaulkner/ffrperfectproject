import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WikiUpdateService } from '../../services/wiki-update.service';
import { SubmissionService } from '../../services/submission.service';
import { SongService } from '../../services/song.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { WikiUpdateGroup } from '../../models/wiki-update-group.interface';

@Component({
  selector: 'app-wiki-updates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>{{ isUserWiki ? 'User' : 'Song' }} Wiki Updates Remaining</h1>
      
      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="applyFilters()"
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
            <label class="checkbox-container">
              <input
                type="checkbox"
                [checked]="false"
                (change)="toggleGroupUpdate(group)"
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <div class="group-items">
            <p *ngFor="let item of group.items" class="item-title">
              {{ item.title }}
            </p>
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
  isUserWiki: boolean = false;
  searchTerm: string = '';
  private groupsSubject = new BehaviorSubject<WikiUpdateGroup[]>([]);
  filteredGroups$ = new Observable<WikiUpdateGroup[]>();
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private wikiUpdateService: WikiUpdateService,
    private submissionService: SubmissionService,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.isUserWiki = this.route.snapshot.data['type'] === 'user';
    this.loadGroups();
    this.applyFilters();

    // Subscribe to submission updates
    this.subscription.add(
      this.submissionService.submissionUpdates$.subscribe(() => {
        this.loadGroups();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadGroups() {
    this.songService.getSongs().subscribe(songs => {
      this.submissionService.getAllSubmissions().subscribe(submissionMap => {
        const groupMap = new Map<string, WikiUpdateGroup>();

        songs.forEach(song => {
          const submissions = submissionMap[song.id] || [];
          submissions.forEach(sub => {
            if ((this.isUserWiki && !sub.userWikiUpdated) || 
                (!this.isUserWiki && !sub.songWikiUpdated)) {
              const key = this.isUserWiki ? sub.contributor : song.title;
              if (!groupMap.has(key)) {
                groupMap.set(key, {
                  key,
                  items: []
                });
              }
              
              const group = groupMap.get(key)!;
              group.items.push({
                submissionId: sub.id,
                songId: song.id,
                title: this.isUserWiki ? song.title : sub.contributor
              });
            }
          });
        });

        const groups = Array.from(groupMap.values())
          .sort((a, b) => a.key.localeCompare(b.key));
        
        this.groupsSubject.next(groups);
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredGroups$ = this.groupsSubject.pipe(
      map(groups => groups.filter(group => 
        group.key.toLowerCase().includes(searchLower) ||
        group.items.some(item => item.title.toLowerCase().includes(searchLower))
      ))
    );
  }

  async toggleGroupUpdate(group: WikiUpdateGroup) {
    try {
      // Update all submissions in the group
      for (const item of group.items) {
        await this.wikiUpdateService.toggleWikiStatus(
          item.submissionId,
          this.isUserWiki ? 'user' : 'song'
        );
      }
      
      // Remove the group from the list
      const currentGroups = this.groupsSubject.value;
      const updatedGroups = currentGroups.filter(g => g.key !== group.key);
      this.groupsSubject.next(updatedGroups);
    } catch (error) {
      console.error('Error updating wiki status:', error);
    }
  }
}