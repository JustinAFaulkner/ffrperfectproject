import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginModalComponent } from '../login/login-modal.component';
import { AuthService } from '../../services/auth.service';
import { SongSyncService } from '../../services/song-sync.service';
import { AdminMenuComponent } from '../admin/admin-menu.component';
import { ThemeService } from '../../services/theme.service';
import { ConfirmModalComponent } from '../shared/confirm-modal.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginModalComponent,
    AdminMenuComponent,
    ConfirmModalComponent
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
            Admin Login
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
        <div class="mobile-nav-header">
          <div class="mobile-nav-actions">
            <ng-container *ngIf="isLoggedIn$ | async; else mobileLoginButton">
              <button class="nav-btn logout-btn" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </ng-container>
            <ng-template #mobileLoginButton>
              <button class="nav-btn login-btn" (click)="showLoginModal()">
                <i class="fas fa-sign-in-alt"></i>
                Admin Login
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

        <div class="mobile-nav-links">
          <a 
            routerLink="/" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{exact: true}"
            class="nav-link"
            (click)="showMobileMenu = false">
            <i class="fas fa-home"></i>
            Home
          </a>
          <a 
            routerLink="/songs" 
            routerLinkActive="active"
            class="nav-link"
            (click)="showMobileMenu = false">
            <i class="fas fa-music"></i>
            Songs
          </a>
          <a 
            routerLink="/leaderboard" 
            routerLinkActive="active"
            class="nav-link"
            (click)="showMobileMenu = false">
            <i class="fas fa-trophy"></i>
            Leaderboard
          </a>

          <ng-container *ngIf="isLoggedIn$ | async">
            <div class="nav-divider">
              <span>Administration</span>
            </div>
            <div class="admin-actions">
              <div class="nav-link" (click)="onUserWikiList()">
                <i class="fas fa-users"></i>
                User Wiki Updates
              </div>
              <div class="nav-link" (click)="onSongWikiList()">
                <i class="fas fa-music"></i>
                Song Wiki Updates
              </div>
              <div class="nav-link" (click)="onBadgeManagement()">
                <i class="fas fa-award"></i>
                Badge Management
              </div>
              <div class="nav-link" (click)="onSyncLogs()">
                <i class="fas fa-history"></i>
                Song Change Logs
              </div>
              <div class="nav-link"
                (click)="onSyncSongs()"
                [class.disabled]="isSyncing">
                <i class="fas fa-sync"></i>
                {{ isSyncing ? 'Syncing...' : 'Sync New Songs' }}
              </div>
              <div class="nav-link"
                (click)="showResyncConfirm = true"
                [class.disabled]="isSyncing">
                <i class="fas fa-sync-alt"></i>
                {{ isSyncing ? 'Syncing...' : 'Re-Sync All Songs' }}
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>

    <app-login-modal
      *ngIf="showModal"
      (close)="hideLoginModal()">
    </app-login-modal>

    <app-confirm-modal
      *ngIf="showResyncConfirm"
      title="Re-Sync All Songs"
      message="Are you sure you want to re-sync all songs? This will update the song info for all songs in the database."
      confirmText="Re-Sync"
      (confirm)="onResyncAllSongs()"
      (cancel)="showResyncConfirm = false">
    </app-confirm-modal>
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
      width: 85%;
      max-width: 400px;
      height: calc(100vh - 57px);
      background: linear-gradient(135deg, #28aad1 0%, #1a7a9c 100%);
      box-shadow: -2px 0 8px rgba(0,0,0,0.2);
      transition: right 0.3s;
      z-index: 999;
      overflow-y: auto;
    }

    .mobile-nav.open {
      right: 0;
    }

    .mobile-nav-content {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .mobile-nav-header {
      padding: 1.5rem 0.75rem 0.75rem 0.75rem;
      background: rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mobile-nav-actions .nav-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .mobile-nav-actions .nav-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .mobile-nav-actions .theme-toggle-btn {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
    }

    .mobile-nav-actions .theme-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .mobile-nav-links {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-nav .nav-link {
      padding: 0.75rem 1rem;
      color: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.95rem;
    }

    .mobile-nav .nav-link i {
      width: 20px;
      text-align: center;
      font-size: 1rem;
      opacity: 0.9;
    }

    .mobile-nav .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .mobile-nav .nav-link.active {
      background: rgba(255, 255, 255, 0.15);
      font-weight: 500;
    }

    .nav-divider {
      margin: 1rem 0 0.5rem;
      padding: 0 1rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .admin-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .admin-actions .nav-link {
      opacity: 0.9;
    }

    .admin-actions .nav-link.disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
  showResyncConfirm = false;
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


  onSyncLogs() {
    this.router.navigate(['/sync-log']);
  }

  async onSyncSongs() {
    if (this.isSyncing)
      return;
    
    try {
      this.isSyncing = true;
      const result = await this.songSyncService.syncNewSongs();
      alert(
        `Sync complete!\nAdded: ${result.data.inserted} songs`
      );
    } catch (error) {
      console.error('Error syncing songs:', error);
      alert('Error syncing songs. Please try again.');
    } finally {
      this.isSyncing = false;
      this.showMobileMenu = false;
    }
  }


  async onResyncAllSongs() {
    if (this.isSyncing) return;
    
    try {
      this.isSyncing = true;
      this.showResyncConfirm = false;
      await this.songSyncService.resyncAllSongs();
      alert('Songs have been resynced successfully');
    } catch (error) {
      console.error('Error resyncing songs:', error);
      alert('Error resyncing songs. Please try again.');
    } finally {
      this.isSyncing = false;
    }
  }
}