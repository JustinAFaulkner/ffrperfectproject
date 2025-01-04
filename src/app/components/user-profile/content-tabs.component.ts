import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <div class="tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'submissions'"
          (click)="setTab('submissions')">
          <i class="fas fa-file-arrow-up"></i>
          Submissions
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'achievements'"
          (click)="setTab('achievements')">
          <i class="fas fa-award"></i>
          Achievements
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tabs-container {
      margin-bottom: 1.5rem;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 2px solid #eee;
      padding-bottom: 1px;
    }

    :host-context(body.dark-mode) .tabs {
      border-bottom-color: #333;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      transition: all 0.2s;
    }

    :host-context(body.dark-mode) .tab-btn {
      color: #999;
    }

    .tab-btn::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #28aad1;
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    .tab-btn.active {
      color: #28aad1;
    }

    .tab-btn.active::after {
      transform: scaleX(1);
    }

    .tab-btn:hover:not(.active) {
      color: #28aad1;
    }

    @media (max-width: 480px) {
      .tab-btn {
        flex: 1;
        justify-content: center;
      }
    }
  `]
})
export class ContentTabsComponent {
  @Input() activeTab: 'submissions' | 'achievements' = 'submissions';
  @Output() tabChange = new EventEmitter<'submissions' | 'achievements'>();

  setTab(tab: 'submissions' | 'achievements') {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}