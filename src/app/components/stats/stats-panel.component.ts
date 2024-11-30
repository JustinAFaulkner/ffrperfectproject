import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-panel">
      <div class="stat-group">
        <div class="stat-item">
          <span class="stat-label">Songs</span>
          <span class="stat-value">{{totalSongs$ | async}}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Artists</span>
          <span class="stat-value">{{uniqueArtists$ | async}}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Genres</span>
          <span class="stat-value">{{uniqueGenres$ | async}}</span>
        </div>
      </div>
      <div class="stat-group">
        <div class="stat-item">
          <span class="stat-label">Submissions</span>
          <span class="stat-value">{{totalSongs$ | async}}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Missing</span>
          <span class="stat-value">{{uniqueArtists$ | async}}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Arrows</span>
          <span class="stat-value">{{totalArrows$ | async}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-panel {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      gap: 2rem;
      justify-content: center;
    }

    .stat-group {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .stats-panel {
        flex-direction: column;
        gap: 1rem;
      }

      .stat-group {
        justify-content: space-around;
      }
    }
  `]
})
export class StatsPanelComponent {
  songlist = this.songService.getSongs();

  totalSongs$ = this.songlist.pipe(map((songs) => songs.length));

  uniqueArtists$ = this.songlist.pipe(
    map((songs) => new Set(songs.map((song) => song.artist)).size)
  );

  uniqueGenres$ = this.songlist.pipe(
    map((songs) => new Set(songs.map((song) => song.genre)).size)
  );

  totalArrows$ = this.songlist.pipe(
    map((songs) =>
      songs.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.arrows;
      }, 0)
    )
  );

  constructor(private songService: SongService) {}
}