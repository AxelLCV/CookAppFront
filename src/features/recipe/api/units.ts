import { apiClient } from '@/config/client';

export type UnitOption = {
  id: number;
  type: string;
  translations: { name: string }[];
};

export async function getUnits(): Promise<UnitOption[]> {
  const response = await apiClient<{ result: UnitOption[] }>('/units');
  return response.result;
}

export type UnitType = 'WEIGHT' | 'VOLUME' | 'QUANTITY';

export async function createUnit(name: string, type: UnitType): Promise<UnitOption> {
  const response = await apiClient<{ result: UnitOption }>('/units', {
    method: 'POST',
    body: JSON.stringify({ name, type }),
  });
  return response.result;
}
