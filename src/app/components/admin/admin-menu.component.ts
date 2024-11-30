import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongSyncService } from '../../services/song-sync.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dropdown" *ngIf="isLoggedIn$ | async">
      <button class="admin-btn" (click)="toggleDropdown()">
        Admin
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="dropdown-menu" *ngIf="isOpen">
        <button class="dropdown-item" (click)="onUserWikiList()">
          User Wiki Update List
        </button>
        <button class="dropdown-item" (click)="onSongWikiList()">
          Song Wiki Update List
        </button>
        <button 
          class="dropdown-item" 
          (click)="onSyncSongs()"
          [disabled]="isSyncing">
          {{ isSyncing ? 'Syncing...' : 'Sync New Songs' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-dropdown {
      position: relative;
      display: inline-block;
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
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 200px;
      z-index: 1000;
      margin-top: 0.5rem;
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

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .dropdown-item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dropdown-item:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  `]
})
export class AdminMenuComponent {
  isOpen = false;
  isSyncing = false;
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private songSyncService: SongSyncService,
    private authService: AuthService
  ) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onUserWikiList() {
    // To be implemented
    this.isOpen = false;
  }

  onSongWikiList() {
    // To be implemented
    this.isOpen = false;
  }

  async onSyncSongs() {
    try {
      this.isSyncing = true;
      const result = await this.songSyncService.syncNewSongs();
      alert(`Sync complete!\nAdded: ${result.added} songs\nExisting: ${result.existing} songs`);
    } catch (error) {
      console.error('Error syncing songs:', error);
      alert('Error syncing songs. Please try again.');
    } finally {
      this.isSyncing = false;
      this.isOpen = false;
    }
  }
}