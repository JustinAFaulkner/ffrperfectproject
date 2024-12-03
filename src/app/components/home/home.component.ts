import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatsComponent } from './project-stats.component';
import { ProjectInfoComponent } from './project-info.component';
import { ProjectSidebarComponent } from './project-sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProjectStatsComponent,
    ProjectInfoComponent,
    ProjectSidebarComponent
  ],
  template: `
    <div class="home-container">
      <div class="main-content">
        <app-project-stats></app-project-stats>
        <app-project-info></app-project-info>
      </div>
      <aside class="sidebar">
        <app-project-sidebar></app-project-sidebar>
      </aside>
    </div>
  `,
  styles: [`
    .home-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    @media (max-width: 1024px) {
      .home-container {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: -1;
      }
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 0;
      }
    }
  `]
})
export class HomeComponent {}