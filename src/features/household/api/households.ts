import { apiClient } from '@/config/client';
import type { CreateHouseholdInput, Household } from '../types/household';

export async function getMyHouseholds(): Promise<Household[]> {
  const response = await apiClient<{ data: Household[] }>('/households', {
    method: 'GET',
  });
  return response.data;
}

export async function createHousehold(data: CreateHouseholdInput): Promise<Household> {
  const response = await apiClient<{ result: Household }>('/households', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.result;
}

export async function addHouseholdMember(householdId: string, username: string): Promise<void> {
  await apiClient(`/households/${householdId}/members`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export async function removeHouseholdMember(householdId: string, userId: string): Promise<void> {
  await apiClient(`/households/${householdId}/members/${userId}`, {
    method: 'DELETE',
  });
}
