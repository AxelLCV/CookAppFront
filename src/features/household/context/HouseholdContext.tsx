import { createContext } from 'react';
import type { Household } from '../types/household';

export type HouseholdContextType = {
  households: Household[];
  currentHousehold: Household | null;
  isLoading: boolean;
  setCurrentHousehold: (householdId: string) => void;
  refresh: () => Promise<void>;
};

export const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);
