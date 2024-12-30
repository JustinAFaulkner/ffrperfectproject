import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAchievement } from '../../models/user-achievement.interface';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-user-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="achievements-list">
      <div 
        *ngFor="let achievement of achievements" 
        class="achievement-item"
        [class.completed]="achievement.isCompleted">
        <div class="achievement-left">
            <div class="achievement-icon">
                <i class="fas"
                   [class.fa-check-circle]="achievement.isCompleted"
                   [class.fa-circle]="!achievement.isSecret && !achievement.isCompleted"
                   [class.fa-circle-question]="achievement.isSecret && !achievement.isCompleted"
                ></i>
            </div>
            <div class="achievement-info">
                <h3>{{achievement.name}}</h3>
                <p>{{achievement.description}}</p>
            </div>
        </div>
        <div class="achievement-badge">
          <i title="This achievement also grants an FFR profile badge"
             class="fas" [class.fa-solid]="achievement.givesBadge" [class.fa-award]="achievement.givesBadge"
             (click)="showBadgeExplainer()"></i>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievements-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .achievement-item {
      flex: 1 1 calc(50% - 10px);
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
      justify-content: space-between;
    }

    :host-context(body.dark-mode) .achievement-item {
      background: #2d2d2d;
    }

    .achievement-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .achievement-item.completed {
      border-left: 4px solid #48bb78;
    }

    .achievement-icon {
      font-size: 1.5rem;
      color: #cccccc;
    }

    .completed .achievement-icon {
      color: #48bb78;
    }

    .achievement-info h3 {
      margin: 0;
      font-size: 1rem;
      color: #333333;
    }

    .achievement-badge {
      font-size: 1.5rem;
      color: #28aad1;
      align-items: flex-end;
      cursor: help;
      margin-right: 1rem;
    }

    :host-context(body.dark-mode) .achievement-info h3 {
      color: #e0e0e0;
    }

    .achievement-info p {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      color: #666666;
    }

    :host-context(body.dark-mode) .achievement-info p {
      color: #999999;
    }
    
    @media (max-width: 600px) {
        .item {
            flex: 1 1 100%;
        }
    }
  `]
})
export class UserAchievementsComponent {
  @Input() achievements: UserAchievement[] = [];

  constructor(private popup: PopupService) {}

  showBadgeExplainer(){
    this.popup.show('This achievement also grants an FFR profile badge');
  }
}