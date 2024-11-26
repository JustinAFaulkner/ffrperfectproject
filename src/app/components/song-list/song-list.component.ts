import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { Song } from '../../models/song.interface';
import { SongService } from '../../services/song.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
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
              </button>
              <button
                [class.active]="videoFilter === 'with'"
                (click)="setVideoFilter('with')"
                class="video-toggle-btn">
                Completed
              </button>
              <button
                [class.active]="videoFilter === 'without'"
                (click)="setVideoFilter('without')"
                class="video-toggle-btn">
                Missing
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
        <div *ngFor="let song of filteredSongs" 
             class="song-item"
             [class.has-video]="song.youtubeUrl"
             [class.no-video]="!song.youtubeUrl">
          <div class="song-header" (click)="toggleSong(song)">
            <div class="song-diff">
              {{song.difficulty}}
            </div>
            <div class="song-info">
              <span class="song-title">{{song.title}}</span>
              <span class="song-artist">{{song.artist}}</span>
            </div>
            <div class="song-details">
              <span class="song-duration">{{song.duration}}</span>
              <span class="song-genre">{{song.genre}}</span>
            </div>
          </div>
          
          <div class="song-content" *ngIf="expandedSong === song.id" [@expandCollapse]>
            <div class="video-container" *ngIf="song.youtubeUrl; else noVideo">
              <iframe
                [src]="getSafeUrl(song.youtubeUrl)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
            <ng-template #noVideo>
              <div class="missing-video">
                <img 
                  src="https://placehold.co/600x400?text=Video+Not+Available"
                  alt="Video not available"
                />
              </div>
            </ng-template>
          </div>
        </div>
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
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .video-toggle-btn:hover:not(.active) {
      background: rgba(255,255,255,0.5);
    }

    .song-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .song-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: relative;
    }

    .song-item.has-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(144, 238, 144, 0.2) 100%
      );
    }

    .song-item.no-video {
      background: linear-gradient(135deg, 
        white 0%, 
        white 60%, 
        rgba(255, 99, 71, 0.2) 100%
      );
    }

    .song-diff {
      display: inline-block;
      padding: 0.5em 0.5em 0.5em 0;
      margin: auto 0.5em auto 0;
      border-right: 2px solid black;
      font-weight: bold;
    }

    .song-header {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
      z-index: 1;
    }

    .song-header:hover {
      background-color: rgba(248, 248, 248, 0.7);
    }

    .song-info {
      flex: 2;
      display: flex;
      flex-direction: column;
    }

    .song-title {
      font-weight: bold;
      color: #333;
    }

    .song-artist {
      color: #666;
      font-size: 0.9em;
    }

    .song-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .song-duration, .song-genre {
      color: #666;
      font-size: 0.9em;
    }

    .song-content {
      border-top: 1px solid #eee;
      overflow: hidden;
    }

    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    }

    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .missing-video {
      padding: 20px;
      text-align: center;
    }

    .missing-video img {
      max-width: 100%;
      height: auto;
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

  constructor(
    private songService: SongService,
    private filterService: FilterService,
    private sanitizer: DomSanitizer
  ) {
    this.songs = this.songService.getSongs();
    this.filteredSongs = [...this.songs];
    this.genres = [...new Set(this.songs.map((song) => song.genre))];
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

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
