"use client";
import { useState, useEffect } from 'react';
import { apiFetch, Product } from '@erpio/shared';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiFetch<Product[]>('/products');
        setProducts(data);
      } catch (err) {
        setError('Не удалось загрузить товары');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
