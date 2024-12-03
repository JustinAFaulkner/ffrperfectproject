import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongFilters } from '../../models/song-filters.interface';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer-backdrop" [class.open]="isOpen" (click)="close.emit()">
      <div class="drawer" [class.open]="isOpen" (click)="$event.stopPropagation()">
        <div class="drawer-header">
          <h2>Advanced Filters</h2>
          <button class="close-btn" (click)="close.emit()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="drawer-content">
          <div class="filter-section">
            <h3>Genre</h3>
            <select [(ngModel)]="filters.genre" (ngModelChange)="filtersChanged()">
              <option value="">All Genres</option>
              <option *ngFor="let genre of genres" [value]="genre">{{genre}}</option>
            </select>
          </div>

          <div class="filter-section">
            <h3>Note Count</h3>
            <div class="range-inputs">
              <input
                type="number"
                [(ngModel)]="filters.minNoteCount"
                (ngModelChange)="filtersChanged()"
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                [(ngModel)]="filters.maxNoteCount"
                (ngModelChange)="filtersChanged()"
                placeholder="Max"
              />
            </div>
          </div>

          <div class="filter-section">
            <h3>Length (seconds)</h3>
            <div class="range-inputs">
              <input
                type="number"
                [(ngModel)]="filters.minLength"
                (ngModelChange)="filtersChanged()"
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                [(ngModel)]="filters.maxLength"
                (ngModelChange)="filtersChanged()"
                placeholder="Max"
              />
            </div>
          </div>

          <div class="filter-section">
            <h3>Release Date</h3>
            <input
              type="date"
              [(ngModel)]="filters.releaseDate"
              (ngModelChange)="filtersChanged()"
            />
          </div>

          <div class="filter-section mobile-only">
            <h3>Difficulty</h3>
            <div class="range-inputs">
              <input
                type="number"
                [(ngModel)]="filters.minDifficulty"
                (ngModelChange)="filtersChanged()"
                placeholder="Min"
                min="0"
                [max]="filters.maxDifficulty"
              />
              <span>to</span>
              <input
                type="number"
                [(ngModel)]="filters.maxDifficulty"
                (ngModelChange)="filtersChanged()"
                placeholder="Max"
                [min]="filters.minDifficulty"
                max="150"
              />
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="reset-btn" (click)="resetFilters()">Reset Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s;
    }

    .drawer-backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: -400px;
      width: 100%;
      max-width: 400px;
      height: 100%;
      background: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      transition: right 0.3s;
      display: flex;
      flex-direction: column;
    }

    :host-context(body.dark-mode) .drawer {
      background: #2d2d2d;
    }

    .drawer.open {
      right: 0;
    }

    .drawer-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :host-context(body.dark-mode) .drawer-header {
      border-bottom-color: #444;
    }

    .drawer-header h2 {
      margin: 0;
      color: #333;
    }

    :host-context(body.dark-mode) .drawer-header h2 {
      color: #e0e0e0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
    }

    :host-context(body.dark-mode) .close-btn {
      color: #999;
    }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .filter-section {
      margin-bottom: 2rem;
    }

    .filter-section h3 {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 1rem;
    }

    :host-context(body.dark-mode) .filter-section h3 {
      color: #999;
    }

    .range-inputs {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    input, select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    :host-context(body.dark-mode) input,
    :host-context(body.dark-mode) select {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .range-inputs input {
      width: 100px;
    }

    select {
      width: 100%;
    }

    .drawer-footer {
      padding: 1.5rem;
      border-top: 1px solid #eee;
    }

    :host-context(body.dark-mode) .drawer-footer {
      border-top-color: #444;
    }

    .reset-btn {
      width: 100%;
      padding: 0.75rem;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      color: #666;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    :host-context(body.dark-mode) .reset-btn {
      background: #333;
      color: #e0e0e0;
    }

    .reset-btn:hover {
      background: #e0e0e0;
    }

    :host-context(body.dark-mode) .reset-btn:hover {
      background: #444;
    }

    .mobile-only {
      display: none;
    }

    @media (max-width: 768px) {
      .mobile-only {
        display: block;
      }
    }
  `]
})
export class FilterDrawerComponent {
  @Input() isOpen = false;
  @Input() filters!: SongFilters;
  @Input() genres: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<SongFilters>();

  filtersChanged() {
    this.filterChange.emit(this.filters);
  }

  resetFilters() {
    Object.assign(this.filters, {
      genre: '',
      minNoteCount: 0,
      maxNoteCount: 99999,
      minLength: 0,
      maxLength: 9999,
      releaseDate: null,
      minDifficulty: 0,
      maxDifficulty: 150
    });
    this.filtersChanged();
  }
}