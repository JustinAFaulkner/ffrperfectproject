import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongSyncService } from '../../services/song-sync.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmModalComponent } from '../shared/confirm-modal.component';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  template: `
    <div class="admin-dropdown" *ngIf="isLoggedIn$ | async">
      <button class="admin-btn">
        Admin
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="dropdown-menu">
        <button class="dropdown-item" (click)="onUserWikiList()">
          User Wiki Update List
        </button>
        <button class="dropdown-item" (click)="onSongWikiList()">
          Song Wiki Update List
        </button>
        <button class="dropdown-item" (click)="onBadgeManagement()">
          Badge Management
        </button>
        <button class="dropdown-item" (click)="onSyncLogs()">
          Song Change Logs
        </button>
        <button 
          class="dropdown-item" 
          (click)="onSyncSongs()"
          [disabled]="isSyncing">
          {{ isSyncing ? 'Syncing...' : 'Sync New Songs' }}
        </button>
        <button 
          class="dropdown-item" 
          (click)="showResyncConfirm = true"
          [disabled]="isSyncing">
          {{ isSyncing ? 'Syncing...' : 'Re-Sync All Songs' }}
        </button>
      </div>
    </div>

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
    .admin-dropdown {
      position: relative;
      display: inline-block;
    }

    .admin-dropdown:hover .dropdown-menu {
      display: block;
    }

    .admin-btn {
      padding: 0.5rem 1rem;
      background: #28aad1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .admin-btn:hover {
      background: #2391b2;
    }

    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 200px;
      z-index: 1000;
      margin-top: 0;
    }

    :host-context(body.dark-mode) .dropdown-menu {
      background: #2d2d2d;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.9rem;
      color: #333;
    }

    :host-context(body.dark-mode) .dropdown-item {
      color: #e0e0e0;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    :host-context(body.dark-mode) .dropdown-item:hover {
      background: #404040;
    }

    .dropdown-item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dropdown-item:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    :host-context(body.dark-mode) .dropdown-item:not(:last-child) {
      border-bottom-color: #404040;
    }
  `]
})
export class AdminMenuComponent {
  isOpen = false;
  isSyncing = false;
  showResyncConfirm = false;
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private router: Router,
    private songSyncService: SongSyncService,
    private authService: AuthService
  ) {}

  onUserWikiList() {
    this.router.navigate(['/user-wiki-updates']);
  }

  onSongWikiList() {
    this.router.navigate(['/song-wiki-updates']);
  }
  
  onBadgeManagement() {
    this.router.navigate(['/badge-management']);
  }

  onSyncLogs() {
    this.router.navigate(['/sync-log']);
  }

  async onSyncSongs() {
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