import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav></app-nav>
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    .app-container {
      padding: 0px 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 95px);
      max-width: 1200px;
      margin: 0 auto;
      transition: background-color 0.3s;
    }

    :host-context(body.dark-mode) .app-container {
      background-color: #141414;
    }
  `,
  ],
})
export class AppComponent {}