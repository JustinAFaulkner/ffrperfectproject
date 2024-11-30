import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container" *ngIf="!isLoggedIn">
      <form (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="email"
            name="email"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="password"
            name="password"
            required
            class="form-control"
          />
        </div>
        <button type="submit" class="login-button">Login</button>
        <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
    <div class="user-info" *ngIf="isLoggedIn">
      <button (click)="logout()" class="logout-button">Logout</button>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 300px;
      margin: 0 auto;
      padding: 20px;
    }

    .login-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .login-button {
      width: 100%;
      padding: 10px;
      background: #28aad1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .login-button:hover {
      background: #2391b2;
    }

    .error-message {
      color: #dc3545;
      margin-top: 10px;
      font-size: 14px;
    }

    .user-info {
      text-align: right;
      padding: 10px;
    }

    .logout-button {
      padding: 8px 16px;
      background: #f0f0f0;
      color: #666;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .logout-button:hover {
      background: #e0e0e0;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe(
      user => this.isLoggedIn = !!user
    );
  }

  async onSubmit() {
    try {
      await this.authService.login(this.email, this.password);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Invalid email or password';
    }
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}