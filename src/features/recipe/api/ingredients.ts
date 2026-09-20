import { apiClient } from '@/config/client';

export type IngredientOption = {
  id: number;
  translations: { name: string }[];
};

export async function searchIngredients(search: string): Promise<IngredientOption[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiClient<{ result: IngredientOption[] }>(`/ingredients${query}`);
  return response.result;
}

export type CreateIngredientInput = {
  name: string;
  departmentId: number;
  density?: number;
  averageWeight?: number;
};

export async function createIngredient(data: CreateIngredientInput): Promise<IngredientOption> {
  const response = await apiClient<{ result: IngredientOption }>('/ingredients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.result;
}
