import { Preferences } from '@capacitor/preferences';
import type { User } from '../types/auth';

const USER_KEY = 'cached_user';

export async function saveCachedUser(user: User): Promise<void> {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
}

export async function getCachedUser(): Promise<User | null> {
  const { value } = await Preferences.get({ key: USER_KEY });
  return value ? (JSON.parse(value) as User) : null;
}

export async function removeCachedUser(): Promise<void> {
  await Preferences.remove({ key: USER_KEY });
}
