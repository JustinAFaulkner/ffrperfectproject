import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LeaderboardView = 'submissions' | 'firsts' | 'achievements';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardStateService {
  private viewSubject = new BehaviorSubject<LeaderboardView>('submissions');
  currentView$ = this.viewSubject.asObservable();

  setView(view: LeaderboardView) {
    this.viewSubject.next(view);
  }

  getCurrentView(): LeaderboardView {
    return this.viewSubject.value;
  }
}