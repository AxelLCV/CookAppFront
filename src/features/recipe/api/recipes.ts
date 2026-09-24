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
  search?: string;
  page?: number;
  limit?: number;
};

export type PaginatedRecipes = {
  data: Recipe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function getRecipes(filters?: GetRecipesFilters): Promise<PaginatedRecipes> {
  const params = new URLSearchParams();
  if (filters?.authorId) params.set('authorId', filters.authorId);
  if (filters?.favoritedByMe) params.set('favoritedByMe', 'true');
  if (filters?.search) params.set('search', filters.search);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const query = params.toString();

  return apiClient<PaginatedRecipes>(`/recipes${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
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