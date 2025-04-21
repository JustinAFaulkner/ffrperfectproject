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
          <span class="tab-count">{{submissionCount}}</span>
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'achievements'"
          (click)="setTab('achievements')">
          <i class="fas fa-award"></i>
          Achievements
          <span class="tab-count">{{achievementCount}}/{{totalAchievements}}</span>
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
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
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
      font-weight: 500;
    }

    .tab-btn.active::after {
      transform: scaleX(1);
    }

    .tab-btn:hover:not(.active) {
      color: #28aad1;
    }

    .tab-count {
      background: rgba(40, 170, 209, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.85rem;
      color: #28aad1;
    }

    .active .tab-count {
      background: #28aad1;
      color: white;
    }

    @media (max-width: 480px) {
      .tab-btn {
        flex: 1;
        justify-content: center;
        padding: 1rem 0.5rem;
      }
    }
  `]
})
export class ContentTabsComponent {
  @Input() activeTab: 'submissions' | 'achievements' = 'submissions';
  @Input() submissionCount: number = 0;
  @Input() achievementCount: number = 0;
  @Input() totalAchievements: number = 0;
  @Output() tabChange = new EventEmitter<'submissions' | 'achievements'>();

  setTab(tab: 'submissions' | 'achievements') {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}