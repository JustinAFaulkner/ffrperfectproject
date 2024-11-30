import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login/login-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, LoginModalComponent],
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
        <button class="nav-link active">Songs</button>
        <button class="nav-link">Leaderboard</button>
        <!-- Additional nav items can be added here -->
      </div>
      <div class="nav-auth">
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

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class NavComponent {
  showModal = false;
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(private authService: AuthService) {}

  showLoginModal() {
    this.showModal = true;
  }

  hideLoginModal() {
    this.showModal = false;
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}