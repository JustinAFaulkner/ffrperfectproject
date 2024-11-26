import { Component } from '@angular/core';
import { SongListComponent } from './components/song-list/song-list.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SongListComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-song-list></app-song-list>
    </div>
  `,
  styles: [
    `
    .app-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }
  `,
  ],
})
export class AppComponent {}
