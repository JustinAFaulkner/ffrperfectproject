import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { StatsPanelComponent } from './components/stats/stats-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, StatsPanelComponent],
  template: `
    <app-nav></app-nav>
    <div class="app-container">
      <app-stats-panel></app-stats-panel>
      <router-outlet></router-outlet>
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