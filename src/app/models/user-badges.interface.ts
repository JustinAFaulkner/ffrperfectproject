export interface UserBadges {
  badge_one: boolean;
  badge_two: boolean;
  badge_three: boolean;
}

export interface ContributorBadges {
  username: string;
  submissionCount: number;
  firstCount: number;
  badges: {
    badge1: boolean;
    badge2: boolean;
    badge3: boolean;
  };
}

export type BadgeKey = keyof UserBadges;