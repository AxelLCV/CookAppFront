export type HouseholdRole = 'OWNER' | 'MEMBER';

export type HouseholdMember = {
  userId: string;
  householdId: string;
  role: HouseholdRole;
  joinedAt: string;
  user: {
    id: string;
    username: string;
  };
};

export type Household = {
  id: string;
  name: string;
  createdAt: string;
  members: HouseholdMember[];
};

export type CreateHouseholdInput = {
  name: string;
};
