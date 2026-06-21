const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Важно для работы с httpOnly куками
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Здесь можно добавить обработку 401 (Unauthorized) для редиректа на логин
    if (response.status === 401) {
      console.warn('Session expired or unauthorized');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
