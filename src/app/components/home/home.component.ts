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
      <div class="sidebar">
        <app-project-sidebar></app-project-sidebar>
      </div>
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

    .main-content {
      min-width: 0; /* Prevents content from overflowing */
    }

    .sidebar {
      position: sticky;
      top: 1rem;
      height: fit-content;
    }

    @media (max-width: 1024px) {
      .home-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .sidebar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        position: static;
      }
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 0.5rem;
      }

      .sidebar {
        display: block;
      }
    }
  `]
})
export class HomeComponent {}