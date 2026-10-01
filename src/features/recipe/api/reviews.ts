import { apiClient } from '@/config/client';
import type { ReviewsPage, UpsertReviewInput } from '../types/review';

export async function getReviews(slug: string, page = 1, limit = 10): Promise<ReviewsPage> {
  return apiClient<ReviewsPage>(`/recipes/${slug}/reviews?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
}

export async function upsertReview(slug: string, data: UpsertReviewInput) {
  return apiClient(`/recipes/${slug}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteReview(slug: string): Promise<void> {
  await apiClient(`/recipes/${slug}/reviews`, {
    method: 'DELETE',
  });
}
