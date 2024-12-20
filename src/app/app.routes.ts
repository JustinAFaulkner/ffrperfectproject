import { Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { WikiUpdatesComponent } from './components/wiki-updates/wiki-updates.component';
import { BadgeManagementComponent } from './components/badge-management/badge-management.component';
import { SyncLogsComponent } from './components/sync-logs/sync-logs.component';
import { SyncLogDetailsComponent } from './components/sync-logs/sync-log-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'songs', component: SongListComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'user/:username', component: UserProfileComponent },
  { 
    path: 'user-wiki-updates', 
    component: WikiUpdatesComponent,
    canActivate: [authGuard],
    data: { type: 'user' }
  },
  { 
    path: 'badge-management',
    component: BadgeManagementComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'song-wiki-updates', 
    component: WikiUpdatesComponent,
    canActivate: [authGuard],
    data: { type: 'song' }
  },
  {
    path: 'sync-log',
    component: SyncLogsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'sync-log/:filename',
    component: SyncLogDetailsComponent,
    canActivate: [authGuard]
  }
];