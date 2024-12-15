import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="access-denied">
      <div class="content">
        <i class="fas fa-lock icon"></i>
        <h2>Access Denied</h2>
        <p>You need to be logged in to view this page.</p>
        <a routerLink="/" class="home-link">Return to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .access-denied {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 2rem;
    }

    .content {
      text-align: center;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 400px;
      width: 100%;
    }

    :host-context(body.dark-mode) .content {
      background: #2d2d2d;
    }

    .icon {
      font-size: 3rem;
      color: #28aad1;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 1rem;
      color: #333;
    }

    :host-context(body.dark-mode) h2 {
      color: #e0e0e0;
    }

    p {
      margin: 0 0 1.5rem;
      color: #666;
    }

    :host-context(body.dark-mode) p {
      color: #999;
    }

    .home-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #28aad1;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .home-link:hover {
      background: #2391b2;
    }
  `]
})
export class AccessDeniedComponent {}