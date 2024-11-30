import { Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', component: SongListComponent },
  { path: 'leaderboard', component: LeaderboardComponent }
];