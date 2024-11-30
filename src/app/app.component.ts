import { Component } from '@angular/core';
import { SongListComponent } from './components/song-list/song-list.component';
import { NavComponent } from './components/nav/nav.component';
import { StatsPanelComponent } from './components/stats/stats-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SongListComponent, NavComponent, StatsPanelComponent],
  template: `
    <app-nav></app-nav>
    <div class="app-container">
      <app-stats-panel></app-stats-panel>
      <app-song-list></app-song-list>
    </div>
  `,
  styles: [
    `
    .app-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 57px);
      max-width: 1200px;
      margin: 0 auto;
    }
  `,
  ],
})
export class AppComponent {}