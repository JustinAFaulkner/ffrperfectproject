import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sort-container">
      <select [(ngModel)]="sortBy" (ngModelChange)="onSortChange()">
        <option value="id">Song ID</option>
        <option value="title">Title</option>
        <option value="difficulty">Difficulty</option>
        <option value="seconds">Length</option>
      </select>
      <button class="direction-btn" (click)="toggleDirection()">
        <i class="fas" [class.fa-sort-up]="sortDirection === 'asc'" [class.fa-sort-down]="sortDirection === 'desc'"></i>
      </button>
    </div>
  `,
  styles: [`
    .sort-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      background: white;
    }

    :host-context(body.dark-mode) select {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .direction-btn {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
    }

    :host-context(body.dark-mode) .direction-btn {
      background: #333;
      border-color: #444;
      color: #e0e0e0;
    }

    .direction-btn:hover {
      background: #f5f5f5;
    }

    :host-context(body.dark-mode) .direction-btn:hover {
      background: #444;
    }
  `]
})
export class SortSelectComponent {
  @Input() sortBy = 'id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Output() sortChange = new EventEmitter<{sortBy: string, sortDirection: 'asc' | 'desc'}>();

  onSortChange() {
    this.sortChange.emit({ sortBy: this.sortBy, sortDirection: this.sortDirection });
  }

  toggleDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.onSortChange();
  }
}