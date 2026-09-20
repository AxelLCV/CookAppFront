import { apiClient } from '@/config/client';
import type { CreateRecipeInput, Recipe, RecipeDetail } from '../types/recipes';

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  const response = await apiClient<{ result: Recipe }>('/recipes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.result;
}

export async function getRecipes(): Promise<Recipe[]> {
  const response = await apiClient<{ data: Recipe[] }>('/recipes', {
    method: 'GET',
  });
  return response.data;
}

export async function getRecipe(slug: string): Promise<RecipeDetail> {
  const response = await apiClient<{ result: RecipeDetail }>(`/recipes/${slug}`, {
    method: 'GET',
  });
  return response.result;
}