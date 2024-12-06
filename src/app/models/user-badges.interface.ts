export interface UserBadges {
  badge1: boolean;
  badge2: boolean;
  badge3: boolean;
}

export interface ContributorBadges {
  username: string;
  submissionCount: number;
  badges: UserBadges;
}