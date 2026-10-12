import { Preferences } from '@capacitor/preferences';
import type { Household } from '../types/household';

const HOUSEHOLDS_KEY = 'cached_households';

export async function saveCachedHouseholds(households: Household[]): Promise<void> {
  await Preferences.set({ key: HOUSEHOLDS_KEY, value: JSON.stringify(households) });
}

export async function getCachedHouseholds(): Promise<Household[]> {
  const { value } = await Preferences.get({ key: HOUSEHOLDS_KEY });
  return value ? (JSON.parse(value) as Household[]) : [];
}
