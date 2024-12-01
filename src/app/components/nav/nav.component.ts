import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../login/login-modal.component';
import { AuthService } from '../../services/auth.service';
import { AdminMenuComponent } from '../admin/admin-menu.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginModalComponent,
    AdminMenuComponent,
  ],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <img 
          src="https://i.imgur.com/169pgWP.png" 
          crossorigin="anonymous" alt="FFR Perfect Project"
          class="nav-logo"
        />
      </div>
      <div class="nav-links">
        <a 
          routerLink="/" 
          routerLinkActive="active" 
          [routerLinkActiveOptions]="{exact: true}"
          class="nav-link">
          Songs
        </a>
        <a 
          routerLink="/leaderboard" 
          routerLinkActive="active"
          class="nav-link">
          Leaderboard
        </a>
      </div>
      <div class="nav-auth">
        <button 
          class="theme-toggle-btn" 
          (click)="toggleTheme()"
          [attr.aria-label]="(isDarkMode$ | async) ? 'Switch to light mode' : 'Switch to dark mode'">
          <i class="fas" [class.fa-moon]="!(isDarkMode$ | async)" [class.fa-sun]="isDarkMode$ | async"></i>
        </button>
        <app-admin-menu></app-admin-menu>
        <ng-container *ngIf="isLoggedIn$ | async; else loginButton">
          <button class="nav-btn logout-btn" (click)="logout()">
            Logout
          </button>
        </ng-container>
        <ng-template #loginButton>
          <button class="nav-btn login-btn" (click)="showLoginModal()">
            Login
          </button>
        </ng-template>
      </div>
    </nav>
    <app-login-modal
      *ngIf="showModal"
      (close)="hideLoginModal()">
    </app-login-modal>
  `,
  styles: [
    `
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0rem 1rem;
      background: #28aad1;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-brand {
      display: flex;
      align-items: flex-start;
    }

    .nav-logo {
      height: 70px;
      margin-left: -1rem;
      width: auto;
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      border: none;
      background: #28aad1;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
      border-radius: 4px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .nav-link:hover {
      background: #2391b2;
    }

    .nav-link.active {
      background: #2391b2;
      font-weight: bold;
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .login-btn {
      background: #28aad1;
      color: white;
    }

    .login-btn:hover {
      background: #2391b2;
    }

    .logout-btn {
      background: #f0f0f0;
      color: #666;
    }

    .logout-btn:hover {
      background: #e0e0e0;
    }

    .theme-toggle-btn {
      padding: 0.5rem;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      font-size: 1.1rem;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
  `,
  ],
})
export class NavComponent {
  showModal = false;
  isLoggedIn$ = this.authService.isLoggedIn();
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  showLoginModal() {
    this.showModal = true;
  }

  hideLoginModal() {
    this.showModal = false;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}