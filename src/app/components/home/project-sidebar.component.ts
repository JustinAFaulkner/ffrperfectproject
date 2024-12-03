import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar-container">
      <section class="sidebar-section">
        <a href="mailto:ffrperfectproject@gmail.com" class="submit-button">
          <i class="fas fa-envelope"></i>
          Email Submission
        </a>
      </section>

      <section class="sidebar-section">
        <h3>Project Coordinators:</h3>
        <div class="coordinator-links">
          <a href="https://www.flashflashrevolution.com/profile/SubaruPoptart/" target="_blank">SubaruPoptart</a>
          <a href="https://www.flashflashrevolution.com/profile/justin" target="_blank">justin</a>
        </div>

        <h3>Additional Help:</h3>
        <div class="coordinator-links">
          <a href="https://www.flashflashrevolution.com/profile/rushyrulz/" target="_blank">rushyrulz</a>
          <a href="https://www.flashflashrevolution.com/profile/DossarLX+ODI/" target="_blank">DossarLX ODI</a>
        </div>

        <h3>Website:</h3>
        <div class="coordinator-links">
          <a href="https://www.flashflashrevolution.com/profile/justin" target="_blank">justin</a>
        </div>
      </section>

      <section class="sidebar-section">
        <h3>Support FFR:</h3>
        <div class="support-links">
          <a href="https://www.patreon.com/bePatron?u=37274455" target="_blank" class="support-button patreon">
            <i class="fab fa-patreon"></i>
            Support on Patreon
          </a>
          <a href="https://github.com/flashflashrevolution/rCubed" target="_blank" class="support-button github">
            <i class="fab fa-github"></i>
            Contribute on GitHub
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .sidebar-container {
      padding: 1rem;
    }

    .sidebar-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background-color 0.3s;
    }

    :host-context(body.dark-mode) .sidebar-section {
      background: #2d2d2d;
    }

    h3 {
      color: #28aad1;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .submit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #28aad1;
      color: white;
      padding: 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .submit-button:hover {
      background: #2391b2;
    }

    .coordinator-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .coordinator-links a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s;
    }

    :host-context(body.dark-mode) .coordinator-links a {
      color: #999;
    }

    .coordinator-links a:hover {
      color: #28aad1;
    }

    .support-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .support-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .patreon {
      background: #f96854;
      color: white;
    }

    .patreon:hover {
      background: #e85843;
    }

    .github {
      background: #333;
      color: white;
    }

    .github:hover {
      background: #444;
    }

    @media (max-width: 768px) {
      .sidebar-container {
        padding: 0;
      }
    }
  `]
})
export class ProjectSidebarComponent {}