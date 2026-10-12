import { getToken } from '@/features/auth/utils/token';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL n\'est pas définie dans les variables d\'environnement');
}

// Thrown for a response the server actually sent back (4xx/5xx) — the
// request reached the backend. `status` lets callers tell "token rejected"
// (401) apart from any other failure.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Thrown when the request never got a response at all (no connectivity,
// DNS failure, etc.) — as opposed to ApiError, which means the server did
// answer, just with an error status.
export class NetworkError extends Error {
  constructor() {
    super('Network request failed');
    this.name = 'NetworkError';
  }
}

async function doFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch {
    throw new NetworkError();
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getToken();

  const response = await doFetch(`${API_URL}${endpoint}`, {
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
    throw new ApiError(error || `Erreur API: ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// No 'Content-Type' header here: the browser must set it (with the multipart boundary) itself.
export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = await getToken();

  const response = await doFetch(`${API_URL}${endpoint}`, {
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
    throw new ApiError(error || `Erreur API: ${response.status}`, response.status);
  }

  return response.json();
}
