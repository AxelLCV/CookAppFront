import { apiClient } from '@/config/client';
import type { CreateRecipeInput, Recipe, RecipeDetail } from '../types/recipes';

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  const response = await apiClient<{ result: Recipe }>('/recipes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.result;
}

export type GetRecipesFilters = {
  authorId?: string;
  favoritedByMe?: boolean;
};

export async function getRecipes(filters?: GetRecipesFilters): Promise<Recipe[]> {
  const params = new URLSearchParams();
  if (filters?.authorId) params.set('authorId', filters.authorId);
  if (filters?.favoritedByMe) params.set('favoritedByMe', 'true');
  const query = params.toString();

  const response = await apiClient<{ data: Recipe[] }>(`/recipes${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
  return response.data;
}

export async function toggleFavorite(slug: string): Promise<{ isFavorited: boolean }> {
  return apiClient<{ isFavorited: boolean }>(`/recipes/${slug}/favorite`, {
    method: 'POST',
  });
}

export async function getRecipe(slug: string): Promise<RecipeDetail> {
  const response = await apiClient<{ result: RecipeDetail }>(`/recipes/${slug}`, {
    method: 'GET',
  });
  return response.result;
}