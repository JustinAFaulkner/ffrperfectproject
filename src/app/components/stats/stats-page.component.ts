import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, ProjectStats } from '../../services/stats.service';
import { Observable } from 'rxjs';
import { AutoScaleDirective } from '../../directives/auto-scale.directive';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, AutoScaleDirective],
  template: `
    <div class="stats-page" *ngIf="stats$ | async as stats">
      <h1>FFR Perfect Project Statistics</h1>
      
      <div class="stats-section">
        <h2>Project</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Songs Completed</span>
            <div class="stat-content">
              <i class="fas fa-music"></i>
              <div class="value-container">
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width.%]="(stats.songsWithSubmissions / stats.totalSongs) * 100">
                  </div>
                </div>
                <span class="stats-text">
                  {{ stats.songsWithSubmissions }} / {{ stats.totalSongs }}
                  ({{ (stats.songsWithSubmissions / stats.totalSongs) * 100 | number:'1.0-1' }}%)
                </span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Artists Represented</span>
            <div class="stat-content">
              <i class="fas fa-circle-user"></i>
              <div class="value-container">
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    [style.width.%]="(stats.representedArtists / stats.totalArtists) * 100">
                  </div>
                </div>
                <span class="stats-text">
                  {{ stats.representedArtists }} / {{ stats.totalArtists }}
                  ({{ (stats.representedArtists / stats.totalArtists) * 100 | number:'1.0-1' }}%)
                </span>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <span class="stat-label">Contributors</span>
            <div class="stat-content">
              <i class="fas fa-users"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.totalContributors | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Achievements Earned</span>
            <div class="stat-content">
              <i class="fas fa-award"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.totalAchievements | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Submission Scroll Direction</span>
            <div class="stat-content">
              <i class="fas fa-arrow-right-arrow-left fa-rotate-90"></i>
              <div class="value-container">
                <div class="progress-bar-blue">
                  <div 
                    class="progress-red" 
                    [style.width.%]="((stats.totalSubmissions - stats.downscrollCount) / stats.totalSubmissions) * 100">
                  </div>
                </div>
                <span class="stats-text">
                  <div class="color-key">
                    <div class="dot-red"></div>
                    Upscroll ({{ stats.totalSubmissions - stats.downscrollCount | number }})
                  </div>
                  <div class="color-key">
                    <div class="dot-blue"></div>
                    Downscroll ({{ stats.downscrollCount | number }})
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">AAAAs</span>
            <div class="stat-content">
              <i class="fas fa-crosshairs"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.aaaaCount | number}}</span>
                <span class="stats-text">(on {{ stats.songsWithAAAA }} songs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2>FFR Stats</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Project Level</span>
            <div class="stat-content">
              <i class="fas fa-star"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.level}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Total Notes</span>
            <div class="stat-content">
              <img src="assets/icons/4u.png" alt="Arrows" />
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.totalArrows | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Credits Earned</span>
            <div class="stat-content">
              <i class="fas fa-coins"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.credits | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Grand Total</span>
            <div class="stat-content">
              <i class="fas fa-calculator"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.grandTotal | number}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2>YouTube</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Subscribers</span>
            <div class="stat-content">
              <i class="fas fa-users"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.subscribers | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Total Views</span>
            <div class="stat-content">
              <i class="fas fa-eye"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.views | number}}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Videos Uploaded</span>
            <div class="stat-content">
              <i class="fas fa-video"></i>
              <div class="value-container">
                <span class="stat-value" autoScale>{{stats.totalSubmissions | number}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
      text-align: left;
      margin-left: 2rem;
    }

    :host-context(body.dark-mode) h1 {
      color: #e0e0e0;
    }

    .stats-section {
      margin-bottom: 3rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #28aad1;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #28aad1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
      height: 160px;
    }

    :host-context(body.dark-mode) .stat-card {
      background: #2d2d2d;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .stat-card i {
      font-size: 2rem;
      min-width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(40, 170, 209, 0.1);
      color: #28aad1;
    }

    .stat-card img {
      font-size: 2rem;
      min-width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(40, 170, 209, 0.1);
      color: #28aad1;
      padding: 11px;
    }

    .value-container {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      line-height: 1.2;
      white-space: nowrap;
      transform-origin: left;
    }

    :host-context(body.dark-mode) .stat-value {
      color: #e0e0e0;
    }

    .stat-label {
      color: #666;
      font-size: 1rem;
      font-weight: 500;
    }

    :host-context(body.dark-mode) .stat-label {
      color: #999;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: #edf2f7;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    :host-context(body.dark-mode) .progress-bar {
      background: #333;
    }

    .progress {
      height: 100%;
      background: #28aad1;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-bar-blue {
      width: 100%;
      height: 10px;
      background: #28aad1;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-red {
      height: 100%;
      background: #ff0040;
      transition: width 0.3s ease;
    }

    .color-key {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .dot-red {
      height: 8px;
      width: 8px;
      border-radius: 8px;
      background: #ff0040;
    }

    .dot-blue {
      height: 8px;
      width: 8px;
      border-radius: 8px;
      background: #28aad1;
    }

    .stats-text {
      font-size: 0.8rem;
      color: #718096;
    }

    :host-context(body.dark-mode) .stats-text {
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .stats-page {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-left: 1rem;
      }

      .stat-card {
        padding: 1.5rem;
        height: 120px;
      }

      .stat-card i {
        font-size: 1.5rem;
        min-width: 48px;
        height: 48px;
      }
    }

    @media (max-width: 480px) {
      .stat-card {
        height: 100px;
      }
    }
  `]
})
export class StatsPageComponent {
  stats$: Observable<ProjectStats>;

  constructor(private statsService: StatsService) {
    this.stats$ = this.statsService.getProjectStats();
  }
}