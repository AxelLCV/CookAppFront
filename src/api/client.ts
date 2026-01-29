const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNta3p6NjNkNTAwMDAxdG15Mjc3c3JhbnEiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTc2OTcyNDA3NywiZXhwIjoxNzcwMzI4ODc3fQ.AiTitgGbw04ISyaeQRYz2nBhDrx5zhQgUYu3OzS4M_k";//localStorage.getItem('token'); // récupère ton JWT

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include', // si tu utilises cookie
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'API error');
  }

  return res.json();
}
