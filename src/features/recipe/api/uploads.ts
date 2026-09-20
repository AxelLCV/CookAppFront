import { apiUpload } from '@/config/client';

export async function uploadRecipeImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const response = await apiUpload<{ result: string[] }>('/uploads/images', formData);
  return response.result;
}
