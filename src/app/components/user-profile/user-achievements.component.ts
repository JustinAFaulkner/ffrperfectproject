import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAchievement } from '../../models/user-achievement.interface';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-user-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="achievements-grid">
      <div 
        *ngFor="let achievement of achievements" 
        class="achievement-card"
        [class.completed]="achievement.isCompleted"
        [class.secret]="achievement.isSecret && !achievement.isCompleted"
        [class.revealed]="revealedSecrets[achievement.id]"
        [class.help-cursor]="achievement.givesBadge"
        [title]="achievement.givesBadge ? 'This achievement also grants an FFR profile badge!' : ''"
        (click)="showBadgeExplainer(achievement.givesBadge); toggleReveal(achievement)">
        <div class="achievement-icon">
          <i class="fas" [class]="getIconClass(achievement)"></i>
        </div>
        <div class="achievement-content">
          <div class="achievement-header">
            <h3>{{achievement.name}}</h3>
          </div>
          <p [class.blur]="achievement.isSecret && achievement.isCompleted && !revealedSecrets[achievement.id]">
            {{achievement.description}}
          </p>
        </div>
        <img *ngIf="achievement.givesBadge" [src]="getBadgeIcon(achievement)" alt="Badge" />
        <div class="achievement-status">
          <i class="fas" [class]="getStatusIconClass(achievement)"></i>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .achievement-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    :host-context(body.dark-mode) .achievement-card {
      background: #2d2d2d;
    }

    .help-cursor {
      cursor: help;
    }

    .achievement-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent 0%, transparent 85%, rgba(255,255,255,0.1) 100%);
      transition: all 0.3s ease;
    }

    .achievement-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .achievement-card.completed {
      border-color: #48bb78;
    }

    :host-context(body.dark-mode) .completed .achievement-icon {
      color: #48bb78;
    }

    .achievement-card.secret {
      border-color: #805ad5;
    }

    .achievement-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      border-radius: 10px;
      background: #f7fafc;
      color: #718096;
      flex-shrink: 0;
    }

    :host-context(body.dark-mode) .achievement-icon {
      background: #2d2d2d;
      color: #a0aec0;
    }

    .completed .achievement-icon {
      background: #48bb78;
      color: white;
    }

    .secret .achievement-icon {
      background: #805ad5;
      color: white;
    }

    .achievement-content {
      flex: 1;
      min-width: 0;
    }

    .achievement-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .achievement-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
    }

    :host-context(body.dark-mode) .achievement-header h3 {
      color: #e2e8f0;
    }

    .badge-icon {
      color: #28aad1;
      font-size: 1.6rem;
    }

    .achievement-content p {
      margin: 0;
      font-size: 0.875rem;
      color: #718096;
      line-height: 1.4;
      transition: filter 0.3s ease;
    }

    .achievement-content p.blur {
      filter: blur(5px);
      user-select: none;
    }

    :host-context(body.dark-mode) .achievement-content p {
      color: #a0aec0;
    }

    .achievement-status {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: #718096;
      flex-shrink: 0;
    }

    .completed .achievement-status {
      color: #48bb78;
    }

    .secret .achievement-status {
      color: #805ad5;
    }

    @media (max-width: 640px) {
      .achievements-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserAchievementsComponent {
  @Input() achievements: UserAchievement[] = [];
  revealedSecrets: { [key: string]: boolean } = {};

  constructor(private popup: PopupService) {}

  toggleReveal(achievement: UserAchievement) {
    if (achievement.isSecret && achievement.isCompleted) {
      this.revealedSecrets[achievement.id] = !this.revealedSecrets[achievement.id];
    }
  }

  getIconClass(achievement: UserAchievement): string {
    if (achievement.isSecret && !achievement.isCompleted) {
      return 'fa-question';
    }
    
    // Map achievement types to specific icons
    if (achievement.description.toLowerCase().includes('first aaa video')) return 'fa-file-arrow-up';
    if (achievement.description.toLowerCase().includes('aaa videos')) return 'fa-file-arrow-up';
    if (achievement.description.toLowerCase().includes('first')) return 'fa-map-location-dot';
    if (achievement.description.toLowerCase().includes('difficulty')) return 'fa-utensils';
    if (achievement.description.toLowerCase().includes('month')) return 'fa-calendar';
    if (achievement.description.toLowerCase().includes('repeating')) return 'fa-cubes';
    if (achievement.description.toLowerCase().includes('min')) return 'fa-masks-theater';
    if (achievement.description.toLowerCase().includes('hour')) return 'fa-business-time';
    if (achievement.description.toLowerCase().includes('alphabet')) return 'fa-arrow-down-a-z';
    if (achievement.description.toLowerCase().includes('notes')) return 'fa-music';
    if (achievement.description.toLowerCase().includes('genre')) return 'fa-compact-disc';
    if (achievement.description.toLowerCase().includes('public')) return 'fa-users';
    if (achievement.description.toLowerCase().includes('multi')) return 'fa-gamepad';
    if (achievement.description.toLowerCase().includes('on files from')) return 'fa-id-badge';
    
    // Default icon
    return 'fa-trophy';
  }

  getStatusIconClass(achievement: UserAchievement): string {
    if (achievement.isCompleted) return 'fa-check-circle';
    if (achievement.isSecret) return 'fa-lock';
    return 'fa-circle';
  }

  getBadgeIcon(achievement: UserAchievement): string {
    switch(achievement.name) {
      case 'In A Pickle':
        return "assets/icons/InAPickle.png";

      case 'Budding Pioneer':
        return "assets/icons/BuddingPioneer.png";
    }
    return "assets/icons/OutWalkin.png";
  }

  showBadgeExplainer(givesBadge: boolean) {
    if(givesBadge) {
      this.popup.show('This achievement grants an FFR profile badge!');
    }
  }
}