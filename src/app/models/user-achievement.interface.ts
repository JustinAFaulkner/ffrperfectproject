export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  givesBadge: boolean;
  isSecret?: boolean;
}