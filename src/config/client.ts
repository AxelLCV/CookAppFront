import { getToken } from '@/features/auth/utils/token';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL n\'est pas définie dans les variables d\'environnement');
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[apiClient] ${options?.method ?? 'GET'} ${endpoint} -> ${response.status}`, error);
    throw new Error(error || `Erreur API: ${response.status}`);
  }

  return response.json();
}

// No 'Content-Type' header here: the browser must set it (with the multipart boundary) itself.
export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[apiUpload] POST ${endpoint} -> ${response.status}`, error);
    throw new Error(error || `Erreur API: ${response.status}`);
  }

  return response.json();
}