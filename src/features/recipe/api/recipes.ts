import { apiClient } from '@/config/client';
import type { CreateRecipeInput, Recipe } from '../types/recipes';

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  return apiClient('/recipes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}