import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SongWithSubmissions } from '../../models/song-with-submissions.interface';
import { SongService } from '../../services/song.service';
import { FilterService } from '../../services/filter.service';
import { CountService } from '../../services/count.service';
import { SongItemComponent } from './song-item.component';
import { FilterDrawerComponent } from './filter-drawer.component';
import { SortSelectComponent } from './sort-select.component';
import { SongFilters, defaultFilters } from '../../models/song-filters.interface';
import { StatsPanelComponent } from '../stats/stats-panel.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    SongItemComponent,
    FilterDrawerComponent,
    SortSelectComponent,
    StatsPanelComponent
  ],
  template: `
    <app-stats-panel></app-stats-panel>
    <div class="container">
      <div class="filters">
        <div class="search-filters">
          <input
            type="text"
            [(ngModel)]="filters.searchTerm"
            (ngModelChange)="filterSongs()"
            placeholder="Search songs..."
            class="search-input"
          />
          
          <app-sort-select
            [sortBy]="filters.sortBy"
            [sortDirection]="filters.sortDirection"
            (sortChange)="onSortChange($event)">
          </app-sort-select>

          <button class="filter-btn" (click)="toggleFilterDrawer()">
            <i class="fas fa-filter"></i>
            Filters
            <span class="filter-count" *ngIf="activeFilterCount > 0">
              {{activeFilterCount}}
            </span>
            <button class="clear-filters" *ngIf="activeFilterCount > 0" (click)="clearAllFilters($event)">
              <i class="fas fa-times"></i>
            </button>
          </button>
        </div>
        
        <div class="filter-group">
          <div class="video-filter">
            <div class="video-toggle-group">
              <button
                [class.active]="filters.videoFilter === 'all'"
                (click)="setVideoFilter('all')"
                class="video-toggle-btn">
                All
                <span class="count-badge">{{songs.length}}</span>
              </button>
              <button
                [class.active]="filters.videoFilter === 'with'"
                (click)="setVideoFilter('with')"
                class="video-toggle-btn">
                Completed
                <span class="count-badge">{{videoCounts.withVideo}}</span>
              </button>
              <button
                [class.active]="filters.videoFilter === 'without'"
                (click)="setVideoFilter('without')"
                class="video-toggle-btn">
                Missing
                <span class="count-badge">{{videoCounts.withoutVideo}}</span>
              </button>
            </div>
          </div>

          <div class="difficulty-range desktop-only">
            <label>
              Difficulty Min:
              <input
                type="number"
                [(ngModel)]="filters.minDifficulty"
                (ngModelChange)="filterSongs()"
                min="0"
                [max]="filters.maxDifficulty"
                class="difficulty-input"
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                [(ngModel)]="filters.maxDifficulty"
                (ngModelChange)="filterSongs()"
                [min]="filters.minDifficulty"
                max="150"
                class="difficulty-input"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="song-list-container">
        <cdk-virtual-scroll-viewport 
          class="song-list-viewport"
          [itemSize]="80"
          [minBufferPx]="400"
          [maxBufferPx]="800">
          <div class="song-list">
            <app-song-item
              *cdkVirtualFor="let song of filteredSongs; trackBy: trackBySong"
              [song]="song"
              [isExpanded]="expandedSong === song.id"
              (expandToggle)="toggleSong(song)">
            </app-song-item>
          </div>
        </cdk-virtual-scroll-viewport>
      </div>
    </div>

    <app-filter-drawer
      [isOpen]="showFilterDrawer"
      [filters]="filters"
      [genres]="genres"
      (close)="showFilterDrawer = false"
      (filterChange)="onFilterChange($event)">
    </app-filter-drawer>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
    }

    .filters {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .search-filters {
      display: flex;
      gap: 10px;
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

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #666;
      position: relative;
    }

    :host-context(body.dark-mode) .filter-btn {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .filter-btn:hover {
      background: #f5f5f5;
    }

    :host-context(body.dark-mode) .filter-btn:hover {
      background: #444;
    }

    .filter-count {
      background: #28aad1;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      min-width: 20px;
      text-align: center;
    }

    .clear-filters {
      padding: 4px;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      margin-left: 4px;
    }

    .clear-filters:hover {
      color: #333;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .difficulty-range {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .difficulty-input {
      width: 60px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    :host-context(body.dark-mode) .difficulty-input {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .video-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .video-toggle-group {
      display: flex;
      gap: 5px;
      background: #f0f0f0;
      padding: 3px;
      border-radius: 4px;
    }

    :host-context(body.dark-mode) .video-toggle-group {
      background: #333;
    }

    .video-toggle-btn {
      padding: 6px 12px;
      border: none;
      background: transparent;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s;
    }

    :host-context(body.dark-mode) .video-toggle-btn {
      color: #999;
    }

    .video-toggle-btn.active {
      background: white;
      color: #333;
      font-weight: bold;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .video-toggle-btn.active {
      background: #2d2d2d;
      color: #e0e0e0;
    }

    .video-toggle-btn:hover:not(.active) {
      background: rgba(255,255,255,0.5);
    }

    :host-context(body.dark-mode) .video-toggle-btn:hover:not(.active) {
      background: rgba(255,255,255,0.1);
    }

    .count-badge {
      background: rgba(0,0,0,0.1);
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      min-width: 20px;
      text-align: center;
    }

    :host-context(body.dark-mode) .count-badge {
      background: rgba(255,255,255,0.1);
    }

    .song-list-container {
      flex: 1;
      min-height: 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    :host-context(body.dark-mode) .song-list-container {
      background: #2d2d2d;
    }

    .song-list-viewport {
      height: 100%;
    }

    .song-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      background: #f5f5f5;
      border: none;
      box-shadow: none;
    }
    
    :host-context(body.dark-mode) .song-list {
      background: #141414;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }

      .filters {
        gap: 10px;
      }

      .search-filters {
        flex-wrap: wrap;
      }

      .search-input {
        width: 100%;
        flex: none;
      }

      .filter-group {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
    }
  `]
})
export class SongListComponent {
  songs: SongWithSubmissions[] = [];
  filteredSongs: SongWithSubmissions[] = [];
  genres: string[] = [];
  expandedSong: string | null = null;
  videoCounts = { withVideo: 0, withoutVideo: 0 };
  showFilterDrawer = false;
  filters: SongFilters = { ...defaultFilters };

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.genre) count++;
    if (this.filters.minNoteCount > 0 || this.filters.maxNoteCount < 99999) count++;
    if (this.filters.minLength > 0 || this.filters.maxLength < 999) count++;
    if (this.filters.releaseDate) count++;
    if (this.filters.minDifficulty > 0 || this.filters.maxDifficulty < 150) count++;
    return count;
  }

  constructor(
    private songService: SongService,
    private filterService: FilterService,
    private countService: CountService
  ) {}

  ngOnInit() {
    this.songService.getSongs().subscribe((songs) => {
      this.songs = songs;
      this.filteredSongs = [...songs];
      this.genres = [...new Set(songs.map((song) => song.genre))];
      this.videoCounts = this.countService.getVideoCounts(songs);
      this.filterSongs();
    });
  }

  trackBySong(index: number, song: SongWithSubmissions): string {
    return song.id;
  }

  clearAllFilters(event: Event) {
    event.stopPropagation();
    this.filters = { ...defaultFilters };
    this.filterSongs();
  }

  setVideoFilter(filter: 'all' | 'with' | 'without') {
    this.filters.videoFilter = filter;
    this.filterSongs();
  }

  filterSongs() {
    this.filteredSongs = this.filterService.filterSongs(this.songs, this.filters);
  }

  toggleSong(song: SongWithSubmissions) {
    this.expandedSong = this.expandedSong === song.id ? null : song.id;
  }

  toggleFilterDrawer() {
    this.showFilterDrawer = !this.showFilterDrawer;
  }

  onFilterChange(newFilters: SongFilters) {
    this.filters = { ...newFilters };
    this.filterSongs();
  }

  onSortChange({ sortBy, sortDirection }: { sortBy: string, sortDirection: 'asc' | 'desc' }) {
    this.filters.sortBy = sortBy;
    this.filters.sortDirection = sortDirection;
    this.filterSongs();
  }
}