import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="image-section">
        <img 
          src="https://i.imgur.com/169pgWP.png" 
          crossorigin="anonymous" alt="FFR Perfect Project"
          class="header-image"
        />
      </div>
      <div class="stats-section">
        <h2>FFR Perfect Project</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{totalSongs}} Total Songs</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{uniqueArtists}} Artists</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{uniqueGenres}} Genres</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{totalSongs - 1}} Submissions</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{uniqueArtists}} Missing</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{totalArrows}} Arrows</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
      display: flex;
      background: #28aad1;
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .image-section {
      flex: 2;
      max-height: 110px;
      overflow: hidden;
    }

    .header-image {
      width: 362px;
      height: 108px;
    }

    .stats-section {
      flex: 1;
      padding: 1rem;
      background: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: auto;
    }

    .stats-section h2 {
      margin-bottom: 1rem;
      color: #333;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 50% 50%;
      gap: 0.5rem;
    }

    .stat-item {
      text-align: center;
      padding: 0;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .stat-value {
      display: block;
      font-size: 1rem;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
      }

      .image-section {
        max-height: 200px;
      }

      .stats-section {
        padding: 1rem;
      }
    }
  `,
  ],
})
export class HeaderComponent {
  totalSongs: number = 0;
  totalArrows: number = 0;
  uniqueArtists: number = 0;
  uniqueGenres: number = 0;

  constructor(private songService: SongService) {
    const songs = this.songService.getSongs();
    this.totalSongs = songs.length;
    this.totalArrows = songs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.arrows;
    }, 0);
    this.uniqueArtists = new Set(songs.map((song) => song.artist)).size;
    this.uniqueGenres = new Set(songs.map((song) => song.genre)).size;
  }
}
