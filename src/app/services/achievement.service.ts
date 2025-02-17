import { Injectable } from '@angular/core';
import { UserStats } from '../models/user-stats.interface';
import { UserAchievement } from '../models/user-achievement.interface';
import { hasCompletedAlphabet,
          hasTripletNoteCount,
          hasAllMonths,
          countUniqueGenres,
          getTotalNoteCount,
          getTotalSeconds,
          countStepArtistMatches
        } from '../utils/achievement-utils';

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
      id: 'notes_five',
      name: 'Note Worthy',
      description: 'AAA over 5000 notes on video',
      givesBadge: false
    },
    {
      id: 'notes_fifteen',
      name: 'Precision in Motion',
      description: 'AAA over 15000 notes on video',
      givesBadge: false
    },
    {
      id: 'notes_twentyfive',
      name: 'Unyielding Perfection',
      description: 'AAA over 25000 notes on video',
      givesBadge: false
    },
    {
      id: 'alphabet',
      name: 'Alphabet Soup',
      description: 'Submit AAAs for songs with titles that cover the entire alphabet',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'triplets',
      name: 'Perfect Triplets',
      description: 'Submit a AAA of a song whose note count is 3 repeating digits',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'yearly',
      name: 'Timeless Talent',
      description: 'Submit AAAs for songs whose release dates cover all 12 months',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'genres',
      name: 'Jack of All Tracks',
      description: 'Submit AAAs on songs from 5+ different FFR genres',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'public',
      name: 'Street Cred',
      description: 'Submit 1 AAA obtained in public with others present (not stream)',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'multi',
      name: 'Competitive Perfection',
      description: 'Submit 1 AAA obtained while playing multiplayer',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'hour_one',
      name: 'Clocked In',
      description: 'Submit over 1 hour of AAAs',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'hour_three',
      name: 'Workaholic',
      description: 'Submit over 3 hours of AAAs',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'stepartist_hi19',
      name: 'Hi Again, 19',
      description: 'Submit 2 AAAs on files from hi19hi19',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'stepartist_bmah',
      name: 'bMahsterful',
      description: 'Submit 2 AAAs on files from bmah',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'stepartist_silvuh',
      name: 'Sterling Steps',
      description: 'Submit 2 AAAs on files from Silvuh',
      givesBadge: false,
      isSecret: true
    },
    {
      id: 'stepartist_ztar',
      name: 'Shooting Ztar',
      description: 'Submit 2 AAAs on files from DarkZtar',
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
    const submittedSongs = stats.songs.filter(song => song.submissions.length > 0);
    
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

      case 'triplets':
        return submittedSongs.some(song => hasTripletNoteCount(song.arrows));

      case 'yearly':
        return hasAllMonths(submittedSongs.map(song => song.release));

      case 'genres':
        return countUniqueGenres(submittedSongs.map(song => song.genre)) >= 5;

      case 'notes_five':
        return getTotalNoteCount(submittedSongs.map(song => song.arrows)) >= 5000;

      case 'notes_fifteen':
        return getTotalNoteCount(submittedSongs.map(song => song.arrows)) >= 15000;

      case 'notes_twentyfive':
        return getTotalNoteCount(submittedSongs.map(song => song.arrows)) >= 25000;

      case 'hour_one':
        return getTotalSeconds(submittedSongs.map(song => song.seconds)) >= 3600;

      case 'hour_three':
        return getTotalSeconds(submittedSongs.map(song => song.seconds)) >= 10800;
  
      case 'public':
        return submittedSongs.flatMap(song => song.submissions).some(sub => sub.isPublic);
    
      case 'multi':
        return submittedSongs.flatMap(song => song.submissions).some(sub => sub.isMulti);
      
      case 'stepartist_hi19':
        return countStepArtistMatches(submittedSongs.map(song => song.stepArtist), 'hi19hi19') >= 2;

      case 'stepartist_bmah':
        return countStepArtistMatches(submittedSongs.map(song => song.stepArtist), 'bmah') >= 2;

      case 'stepartist_silvuh':
        return countStepArtistMatches(submittedSongs.map(song => song.stepArtist), 'Silvuh') >= 2;

      case 'stepartist_ztar':
        return countStepArtistMatches(submittedSongs.map(song => song.stepArtist), 'DarkZtar') >= 2;

      default:
        return false;
    }
  }

  getTotalAchievements(): number {
    return this.achievements.length;
  }
}