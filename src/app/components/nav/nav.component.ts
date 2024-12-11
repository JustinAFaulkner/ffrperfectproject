import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginModalComponent } from '../login/login-modal.component';
import { AuthService } from '../../services/auth.service';
import { SongSyncService } from '../../services/song-sync.service';
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

      <!-- Desktop Navigation -->
      <div class="nav-links desktop-nav">
        <a 
          routerLink="/" 
          routerLinkActive="active" 
          [routerLinkActiveOptions]="{exact: true}"
          class="nav-link">
          Home
        </a>
        <a 
          routerLink="/songs" 
          routerLinkActive="active"
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

      <!-- Desktop Auth -->
      <div class="nav-auth desktop-nav">
        <ng-container *ngIf="isLoggedIn$ | async">
          <app-admin-menu></app-admin-menu>
        </ng-container>
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
        <button 
          class="theme-toggle-btn" 
          (click)="toggleTheme()"
          [attr.aria-label]="(isDarkMode$ | async) ? 'Switch to light mode' : 'Switch to dark mode'">
          <i class="fas" [class.fa-moon]="!(isDarkMode$ | async)" [class.fa-sun]="isDarkMode$ | async"></i>
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
        <i class="fas" [class.fa-bars]="!showMobileMenu" [class.fa-times]="showMobileMenu"></i>
      </button>
    </nav>

    <!-- Mobile Navigation Drawer Backdrop -->
    <div 
      class="mobile-nav-backdrop" 
      [class.open]="showMobileMenu"
      (click)="showMobileMenu = false">
    </div>

    <!-- Mobile Navigation Drawer -->
    <div class="mobile-nav" [class.open]="showMobileMenu">
      <div class="mobile-nav-content">
        <div class="mobile-nav-links">
          <a 
            routerLink="/" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{exact: true}"
            class="nav-link"
            (click)="showMobileMenu = false">
            Home
          </a>
          <a 
            routerLink="/songs" 
            routerLinkActive="active"
            class="nav-link"
            (click)="showMobileMenu = false">
            Songs
          </a>
          <a 
            routerLink="/leaderboard" 
            routerLinkActive="active"
            class="nav-link"
            (click)="showMobileMenu = false">
            Leaderboard
          </a>

          <ng-container *ngIf="isLoggedIn$ | async">
            <hr class="nav-divider" />
            <h3 class="admin-header">FFRPP Administration</h3>
            <div class="admin-actions">
              <div class="nav-link" (click)="onUserWikiList()">
                User Wiki Update List
              </div>
              <div class="nav-link" (click)="onSongWikiList()">
                Song Wiki Update List
              </div>
              <div class="nav-link" (click)="onBadgeManagement()">
                Badge Management
              </div>
              <div class="nav-link"
                (click)="onSyncSongs()"
                [class.disabled]="isSyncing">
                {{ isSyncing ? 'Syncing...' : 'Sync New Songs' }}
              </div>
            </div>
          </ng-container>
        </div>

        <div class="mobile-nav-footer">
          <div class="mobile-nav-actions">
            <ng-container *ngIf="isLoggedIn$ | async; else mobileLoginButton">
              <button class="nav-btn logout-btn" (click)="logout()">
                Logout
              </button>
            </ng-container>
            <ng-template #mobileLoginButton>
              <button class="nav-btn login-btn" (click)="showLoginModal()">
                Login
              </button>
            </ng-template>
            <button 
              class="theme-toggle-btn" 
              (click)="toggleTheme()"
              [attr.aria-label]="(isDarkMode$ | async) ? 'Switch to light mode' : 'Switch to dark mode'">
              <i class="fas" [class.fa-moon]="!(isDarkMode$ | async)" [class.fa-sun]="isDarkMode$ | async"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <app-login-modal
      *ngIf="showModal"
      (close)="hideLoginModal()">
    </app-login-modal>
  `,
  styles: [`
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
      align-items: center;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
      border-radius: 4px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .nav-link.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
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
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .login-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .logout-btn {
      background: rgba(0, 0, 0, 0.1);
      color: white;
    }

    .logout-btn:hover {
      background: rgba(0, 0, 0, 0.2);
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
      width: 36px;
      height: 36px;
    }

    .theme-toggle-btn:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .mobile-menu-btn {
      display: none;
      padding: 0.5rem;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
    }

    .mobile-nav-backdrop {
      display: none;
      position: fixed;
      top: 57px;
      left: 0;
      width: 100%;
      height: calc(100vh - 57px);
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s;
      z-index: 998;
    }

    .mobile-nav-backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    .mobile-nav {
      display: none;
      position: fixed;
      top: 57px;
      right: -400px;
      width: 66.666%;
      max-width: 400px;
      height: calc(100vh - 57px);
      background: #28aad1;
      box-shadow: -2px 0 8px rgba(0,0,0,0.1);
      transition: right 0.3s;
      z-index: 999;
    }

    .mobile-nav.open {
      right: 0;
    }

    .mobile-nav-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 1rem;
    }

    .mobile-nav-links {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    }

    .mobile-nav .nav-link {
      color: white;
      padding: 0.5rem;
      width: 100%;
      text-align: left;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .mobile-nav .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .mobile-nav .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: bold;
    }

    .nav-divider {
      margin: 1rem 0;
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .admin-header {
      color: white;
      font-size: 0.9rem;
      font-weight: bold;
      margin: 0.5rem 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .admin-actions {
      display: flex;
      flex-direction: column;
    }

    .mobile-nav-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .mobile-nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-nav-actions .nav-btn {
      max-width: 100px;
    }

    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }

      .mobile-menu-btn,
      .mobile-nav,
      .mobile-nav-backdrop {
        display: block;
      }
    }
  `],
})
export class NavComponent {
  showModal = false;
  showMobileMenu = false;
  isSyncing = false;
  isLoggedIn$ = this.authService.isLoggedIn();
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private songSyncService: SongSyncService,
    private themeService: ThemeService
  ) {}

  showLoginModal() {
    this.showModal = true;
    this.showMobileMenu = false;
  }

  hideLoginModal() {
    this.showModal = false;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.showMobileMenu = false;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  onUserWikiList() {
    this.router.navigate(['/user-wiki-updates']);
    this.showMobileMenu = false;

  }

  onSongWikiList() {
    this.router.navigate(['/song-wiki-updates']);
    this.showMobileMenu = false;
  }
  
  onBadgeManagement() {
    this.router.navigate(['/badge-management']);
    this.showMobileMenu = false;
  }

  async onSyncSongs() {
    if (this.isSyncing)
      return;
    
    try {
      this.isSyncing = true;
      const result = await this.songSyncService.syncNewSongs();
      alert(
        `Sync complete!\nAdded: ${result.inserted} songs`
      );
    } catch (error) {
      console.error('Error syncing songs:', error);
      alert('Error syncing songs. Please try again.');
    } finally {
      this.isSyncing = false;
      this.showMobileMenu = false;
    }
  }
}