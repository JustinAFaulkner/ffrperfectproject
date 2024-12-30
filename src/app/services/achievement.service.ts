import { Injectable } from '@angular/core';
import { UserStats } from '../models/user-stats.interface';
import { UserAchievement } from '../models/user-achievement.interface';
import { hasCompletedAlphabet } from '../utils/achievement-utils';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private achievements = [
    {
      id: 'submission_one',
      name: 'First Steps',
      description: 'Submit your first AAA video',
      givesBadge: false
    },
    {
      id: 'submission_five',
      name: 'Out Walkin\'',
      description: 'Submit 5 AAA videos',
      givesBadge: true
    },
    {
      id: 'submission_twenty',
      name: 'Morning Jogs',
      description: 'Submit 20 AAA videos',
      givesBadge: false
    },
    {
      id: 'submission_fifty',
      name: 'Marathon Runner',
      description: 'Submit 50 AAA videos',
      givesBadge: false
    },
    {
      id: 'first_one',
      name: 'Budding Pioneer',
      description: 'Submit the first AAA for a song',
      givesBadge: true
    },
    {
      id: 'first_five',
      name: 'Experienced Trailblazer',
      description: 'Submit the first AAA for 5 songs',
      givesBadge: false
    },
    {
      id: 'first_twenty',
      name: 'Grand Adventurer',
      description: 'Submit the first AAA for 20 songs',
      givesBadge: false
    },
    {
      id: 'diff_one',
      name: 'Piece of Cake',
      description: 'Submit 5 difficulty 10+ AAAs',
      givesBadge: false
    },
    {
      id: 'diff_two',
      name: 'In A Pickle',
      description: 'Submit 5 difficulty 30+ AAAs',
      givesBadge: true
    },
    {
      id: 'diff_three',
      name: 'Tough Nut to Crack',
      description: 'Submit 5 difficulty 50+ AAAs',
      givesBadge: false
    },
    {
      id: 'diff_four',
      name: 'When Life Gives You Lemons',
      description: 'Submit 5 difficulty 70+ AAAs',
      givesBadge: false
    },
    {
      id: 'diff_five',
      name: 'Top Chef',
      description: 'Submit 3 difficulty 90+ AAAs',
      givesBadge: false
    },
    {
      id: 'length_one',
      name: 'Warm-Up Act',
      description: 'Submit 3 AAAs on songs 3min+',
      givesBadge: false
    },
    {
      id: 'length_two',
      name: 'Main Event',
      description: 'Submit 3 AAAs on songs 4min+',
      givesBadge: false
    },
    {
      id: 'length_three',
      name: 'Encore Performance',
      description: 'Submit 3 AAAs on songs 5min+',
      givesBadge: false
    },
    {
      id: 'alphabet',
      name: 'Alphabet Soup',
      description: 'Submit AAAs for songs with titles that cover the entire alphabet',
      givesBadge: false,
      isSecret: true
    }
  ];

  calculateAchievements(stats: UserStats): UserAchievement[] {
    return this.achievements.map(achievement => {
      const isCompleted = this.checkAchievement(achievement.id, stats);
      
      // For secret achievements, only show real description when completed
      if (achievement.isSecret && !isCompleted) {
        return {
          ...achievement,
          description: 'A mysterious achievement',
          isCompleted
        };
      }

      // For completed secret achievements or regular achievements
      return {
        ...achievement,
        isCompleted
      };
    });
  }

  private checkAchievement(id: string, stats: UserStats): boolean {
    switch (id) {
      case 'submission_one':
        return stats.submissionCount > 0;
      
      case 'submission_five':
        return stats.submissionCount > 4;

      case 'submission_twenty':
        return stats.submissionCount > 19;

      case 'submission_fifty':
        return stats.submissionCount > 49;

      case 'first_one':
        return stats.firstSubmissionCount > 0;
        
      case 'first_five':
        return stats.firstSubmissionCount > 4;
          
      case 'first_twenty':
        return stats.firstSubmissionCount > 19;
            
      case 'diff_one':
        return stats.songs.filter(song => 
          song.difficulty > 9 && song.submissions.length > 0
        ).length >= 5;
      
      case 'diff_two':
          return stats.songs.filter(song => 
          song.difficulty > 29 && song.submissions.length > 0
        ).length >= 5;
      
      case 'diff_three':
          return stats.songs.filter(song => 
          song.difficulty > 49 && song.submissions.length > 0
        ).length >= 5;
      
      case 'diff_four':
          return stats.songs.filter(song => 
          song.difficulty > 69 && song.submissions.length > 0
        ).length >= 5;

      case 'diff_five':
        return stats.songs.filter(song => 
        song.difficulty > 89 && song.submissions.length > 0
      ).length >= 3;

      case 'length_one':
        return stats.songs.filter(song => 
          song.seconds >= 180 &&
          song.submissions.length > 0
      ).length >= 3;

      case 'length_two':
        return stats.songs.filter(song => 
          song.seconds >= 240 &&
          song.submissions.length > 0
      ).length >= 3;

      case 'length_three':
        return stats.songs.filter(song => 
          song.seconds >= 300 &&
          song.submissions.length > 0
      ).length >= 3;

      case 'alphabet':
        return hasCompletedAlphabet(
          stats.songs
          .filter(song => song.submissions.length > 0)
          .map(song => song.title)
      );

      default:
        return false;
    }
  }

  getTotalAchievements(): number {
    return this.achievements.length;
  }
}