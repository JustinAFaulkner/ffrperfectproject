import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WikiUpdateService } from '../../services/wiki-update.service';
import { SubmissionService } from '../../services/submission.service';
import { SongService } from '../../services/song.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { WikiUpdateItem } from '../../models/wiki-update-item.interface';

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
          placeholder="Search songs or contributors..."
          class="search-input"
        />
      </div>

      <div class="updates-list">
        <div 
          *ngFor="let item of filteredItems$ | async" 
          class="update-item"
          [class.updated]="item.isUpdated">
          <div class="item-info">
            <h3>{{ item.songTitle }}</h3>
            <p class="contributor">Contributor: {{ item.contributor }}</p>
          </div>
          <label class="checkbox-container">
            <input
              type="checkbox"
              [checked]="item.isUpdated"
              (change)="toggleUpdate(item)"
            />
            <span class="checkmark"></span>
          </label>
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

    .update-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    :host-context(body.dark-mode) .update-item {
      background: #2d2d2d;
    }

    .update-item.updated {
      background: #f0fff4;
      border-left: 4px solid #48bb78;
    }

    :host-context(body.dark-mode) .update-item.updated {
      background: #1a332b;
      border-left: 4px solid #48bb78;
    }

    .item-info {
      flex: 1;
    }

    .item-info h3 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    :host-context(body.dark-mode) .item-info h3 {
      color: #e0e0e0;
    }

    .contributor {
      margin: 0.25rem 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .contributor {
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
  private itemsSubject = new BehaviorSubject<WikiUpdateItem[]>([]);
  filteredItems$ = new Observable<WikiUpdateItem[]>();
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private wikiUpdateService: WikiUpdateService,
    private submissionService: SubmissionService,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.isUserWiki = this.route.snapshot.data['type'] === 'user';
    this.loadItems();
    this.applyFilters();

    // Subscribe to submission updates
    this.subscription.add(
      this.submissionService.submissionUpdates$.subscribe(() => {
        this.loadItems();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadItems() {
    this.songService.getSongs().subscribe(songs => {
      this.submissionService.getAllSubmissions().subscribe(submissionMap => {
        const items: WikiUpdateItem[] = [];
        songs.forEach(song => {
          const submissions = submissionMap[song.id] || [];
          submissions.forEach(sub => {
            if ((this.isUserWiki && !sub.userWikiUpdated) || 
                (!this.isUserWiki && !sub.songWikiUpdated)) {
              items.push({
                submissionId: sub.id,
                songId: song.id,
                songTitle: song.title,
                contributor: sub.contributor,
                isUpdated: this.isUserWiki ? sub.userWikiUpdated : sub.songWikiUpdated
              });
            }
          });
        });
        this.itemsSubject.next(items);
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredItems$ = this.itemsSubject.pipe(
      map(items => items.filter(item => 
        item.songTitle.toLowerCase().includes(searchLower) ||
        item.contributor.toLowerCase().includes(searchLower)
      ))
    );
  }

  async toggleUpdate(item: WikiUpdateItem) {
    try {
      await this.wikiUpdateService.toggleWikiStatus(
        item.submissionId,
        this.isUserWiki ? 'user' : 'song'
      );
      
      // Update the local state immediately
      const currentItems = this.itemsSubject.value;
      const updatedItems = currentItems.map(i => 
        i.submissionId === item.submissionId 
          ? { ...i, isUpdated: true }
          : i
      );
      this.itemsSubject.next(updatedItems);
    } catch (error) {
      console.error('Error updating wiki status:', error);
    }
  }
}