import { Preferences } from '@capacitor/preferences';

const CURRENT_HOUSEHOLD_KEY = 'current_household_id';

export async function saveCurrentHouseholdId(householdId: string): Promise<void> {
  await Preferences.set({ key: CURRENT_HOUSEHOLD_KEY, value: householdId });
}

export async function getCurrentHouseholdId(): Promise<string | null> {
  const { value } = await Preferences.get({ key: CURRENT_HOUSEHOLD_KEY });
  return value;
}
