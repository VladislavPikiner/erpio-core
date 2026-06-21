import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { UserSession } from '../types';

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const data = await apiFetch<UserSession>('/auth/me');
      setUser(data);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  return { user, isLoading, isAuthenticated: !!user };
}
