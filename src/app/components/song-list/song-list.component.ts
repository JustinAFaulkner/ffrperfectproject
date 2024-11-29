import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song } from '../../models/song.interface';
import { SongService } from '../../services/song.service';
import { FilterService } from '../../services/filter.service';
import { CountService } from '../../services/count.service';
import { SongItemComponent } from './song-item.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SongItemComponent],
  template: `
    <div class="container">
      <div class="filters">
        <div class="search-filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterSongs()"
            placeholder="Search songs..."
            class="search-input"
          />
          
          <select [(ngModel)]="selectedGenre" (change)="filterSongs()" class="genre-select">
            <option value="">All Genres</option>
            <option *ngFor="let genre of genres" [value]="genre">{{genre}}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <div class="video-filter">
            <div class="video-toggle-group">
              <button
                [class.active]="videoFilter === 'all'"
                (click)="setVideoFilter('all')"
                class="video-toggle-btn">
                All
                <span class="count-badge">{{songs.length}}</span>
              </button>
              <button
                [class.active]="videoFilter === 'with'"
                (click)="setVideoFilter('with')"
                class="video-toggle-btn">
                Completed
                <span class="count-badge">{{videoCounts.withVideo}}</span>
              </button>
              <button
                [class.active]="videoFilter === 'without'"
                (click)="setVideoFilter('without')"
                class="video-toggle-btn">
                Missing
                <span class="count-badge">{{videoCounts.withoutVideo}}</span>
              </button>
            </div>
          </div>

          <div class="difficulty-range">
            <label>
              Difficulty Min:
              <input
                type="number"
                [(ngModel)]="minDifficulty"
                (input)="filterSongs()"
                min="0"
                [max]="maxDifficulty"
                class="difficulty-input"
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                [(ngModel)]="maxDifficulty"
                (input)="filterSongs()"
                [min]="minDifficulty"
                max="150"
                class="difficulty-input"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="song-list">
        <app-song-item
          *ngFor="let song of filteredSongs"
          [song]="song"
          [isExpanded]="expandedSong === song.id"
          (expandToggle)="toggleSong(song)">
        </app-song-item>
      </div>
    </div>
  `,
  styles: [
    `
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
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

    .search-input, .genre-select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .search-input {
      flex: 1;
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

    .video-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .video-filter-label {
      font-size: 14px;
      color: #666;
      min-width: 80px;
    }

    .video-toggle-group {
      display: flex;
      gap: 5px;
      background: #f0f0f0;
      padding: 3px;
      border-radius: 4px;
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

    .video-toggle-btn.active {
      background: white;
      color: #333;
      font-weight: bold;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .video-toggle-btn:hover:not(.active) {
      background: rgba(255,255,255,0.5);
    }

    .count-badge {
      background: rgba(0,0,0,0.1);
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      min-width: 20px;
      text-align: center;
    }

    .song-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .filters {
        gap: 10px;
      }

      .search-filters {
        flex-direction: column;
      }

      .difficulty-range {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .video-filter {
        flex-direction: column;
        align-items: stretch;
      }

      .video-filter-label {
        margin-bottom: 5px;
      }
    }
  `,
  ],
})
export class SongListComponent {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  searchTerm: string = '';
  selectedGenre: string = '';
  genres: string[] = [];
  expandedSong: number | null = null;
  videoFilter: 'all' | 'with' | 'without' = 'all';
  minDifficulty: number = 0;
  maxDifficulty: number = 150;
  videoCounts = { withVideo: 0, withoutVideo: 0 };

  constructor(
    private songService: SongService,
    private filterService: FilterService,
    private countService: CountService
  ) {}

  ngOnInit() {
    this.songService.getSongs().subscribe(songs => {
      this.songs = songs;
      this.filteredSongs = [...songs];
      this.genres = [...new Set(songs.map(song => song.genre))];
      this.videoCounts = this.countService.getVideoCounts(songs);
    });
  }

  setVideoFilter(filter: 'all' | 'with' | 'without') {
    this.videoFilter = filter;
    this.filterSongs();
  }

  filterSongs() {
    this.filteredSongs = this.filterService.filterSongs(this.songs, {
      searchTerm: this.searchTerm,
      selectedGenre: this.selectedGenre,
      videoFilter: this.videoFilter,
      minDifficulty: this.minDifficulty,
      maxDifficulty: this.maxDifficulty,
    });
  }

  toggleSong(song: Song) {
    this.expandedSong = this.expandedSong === song.id ? null : song.id;
  }
}
