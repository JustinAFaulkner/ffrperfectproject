import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-label">FFR Perfect Project has</div>
        <div class="stat-value">{{ totalSubmissions$ | async }}</div>
        <div class="stat-label">Total Submissions</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Across</div>
        <div class="stat-value">{{ songsWithSubmissions$ | async }}</div>
        <div class="stat-label">Unique Songs</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">From</div>
        <div class="stat-value">{{ uniqueContributors$ | async }}</div>
        <div class="stat-label">Unique Contributors</div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin: 2rem 0;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      min-width: 200px;
      transition: background-color 0.3s;
    }

    :host-context(body.dark-mode) .stat-card {
      background: #2d2d2d;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #28aad1;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 1rem;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    @media (max-width: 768px) {
      .stats-container {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .stat-card {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class ProjectStatsComponent {
  totalSubmissions$ = this.songService.getSongs().pipe(
    map(songs => songs.reduce((total, song) => total + song.submissions.length, 0))
  );

  songsWithSubmissions$ = this.songService.getSongs().pipe(
    map(songs => songs.filter(song => song.submissions.length > 0).length)
  );

  uniqueContributors$ = this.songService.getSongs().pipe(
    map(songs => {
      const contributors = new Set();
      songs.forEach(song => {
        song.submissions.forEach(sub => contributors.add(sub.contributor));
      });
      return contributors.size;
    })
  );

  constructor(private songService: SongService) {}
}