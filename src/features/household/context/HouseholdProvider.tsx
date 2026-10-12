import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { HouseholdContext } from './HouseholdContext';
import { getMyHouseholds } from '../api/households';
import { getCurrentHouseholdId, saveCurrentHouseholdId } from '../utils/currentHousehold';
import { saveCachedHouseholds, getCachedHouseholds } from '../utils/householdCache';
import { useAuth } from '@/features/auth';
import { NetworkError } from '@/config/client';
import type { Household } from '../types/household';

type HouseholdProviderProps = {
  children: ReactNode;
};

export function HouseholdProvider({ children }: HouseholdProviderProps) {
  const { isAuthenticated } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [currentHouseholdId, setCurrentHouseholdId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    let data: Household[];
    try {
      data = await getMyHouseholds();
      await saveCachedHouseholds(data);
    } catch (err) {
      if (!(err instanceof NetworkError)) throw err;
      data = await getCachedHouseholds();
    }
    setHouseholds(data);

    const savedId = await getCurrentHouseholdId();
    const savedIsStillMine = data.some((household) => household.id === savedId);
    const nextId = savedIsStillMine ? savedId : (data[0]?.id ?? null);
    setCurrentHouseholdId(nextId);
    if (nextId) {
      await saveCurrentHouseholdId(nextId);
    }
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (!isAuthenticated) {
        setHouseholds([]);
        setCurrentHouseholdId(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    };
    sync();
  }, [isAuthenticated, refresh]);

  const setCurrentHousehold = (householdId: string) => {
    setCurrentHouseholdId(householdId);
    saveCurrentHouseholdId(householdId);
  };

  const currentHousehold = households.find((household) => household.id === currentHouseholdId) ?? null;

  return (
    <HouseholdContext.Provider
      value={{
        households,
        currentHousehold,
        isLoading,
        setCurrentHousehold,
        refresh,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}
