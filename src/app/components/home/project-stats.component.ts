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
        <div class="stat-info">
          <div class="stat-label">FFR Perfect Project is</div>
          <div class="stat-value">{{ completionPercentage$ | async }}%</div>
          <div class="stat-label">Complete</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Featuring</div>
          <div class="stat-value">{{ totalSubmissions$ | async }}</div>
          <div class="stat-label">Total Submissions</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Across</div>
          <div class="stat-value">{{ songsWithSubmissions$ | async }}</div>
          <div class="stat-label">Unique Songs</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">From</div>
          <div class="stat-value">{{ uniqueContributors$ | async }}</div>
          <div class="stat-label">Contributors</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 0 2rem;
    }

    .stat-card {
      background: white;
      padding: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    :host-context(body.dark-mode) .stat-card {
      background: #2d2d2d;
    }

    .stat-info {
      flex: 1;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: #333;
      line-height: 1.2;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    @media (max-width: 768px) {
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        padding: 0;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-label {
        font-size: 0.8rem;
      }
    }
  `]
})
export class ProjectStatsComponent {
  songsWithSubmissions$ = this.songService.getSongs().pipe(
    map(songs => songs.filter(song => song.submissions.length > 0).length)
  );

  totalSubmissions$ = this.songService.getSongs().pipe(
    map(songs => songs.reduce((sum, song) => 
      sum + song.submissions.length, 0)
  ));

  completionPercentage$ = this.songService.getSongs().pipe(
    map(songs => {
      const total = songs.length;
      const completed = songs.filter(song => song.submissions.length > 0).length;
      return Math.round((completed / total) * 100);
    })
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