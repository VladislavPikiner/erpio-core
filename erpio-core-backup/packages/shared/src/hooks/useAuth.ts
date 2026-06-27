"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { apiFetch } from '../api';
import { UserSession, UserSessionSchema } from '../schemas';

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const response = await apiFetch<any>('/auth/me'); // Получаем any, так как не знаем точный тип до валидации
      const validatedUser = UserSessionSchema.parse(response);
      setUser(validatedUser);
    } catch (e: any) {
      // Zod выбросит ошибку, если данные не соответствуют схеме
      console.error("Authentication session check failed:", e.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  return { user, isLoading, isAuthenticated: !!user };
}
