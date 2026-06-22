import { useState, useEffect } from 'react';
import { apiFetch, Product, PaginationParams, PaginatedResponse } from '../api';

// Добавляем category и price к PaginationParams
interface ExtendedPaginationParams extends PaginationParams {
  category?: string;
  priceRange?: { min: number; max: number };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Используем расширенный тип для пагинации и фильтров
  const [pagination, setPagination] = useState<ExtendedPaginationParams>({ page: 0, limit: 10 });
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [pagination]); // Перерисовываем при изменении пагинации или фильтров

  async function fetchProducts() {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      if (pagination.search) {
        queryParams.append('search', pagination.search);
      }
      // Добавляем параметры фильтрации
      if (pagination.category) {
        queryParams.append('category', pagination.category);
      }
      if (pagination.priceRange) {
        queryParams.append('minPrice', pagination.priceRange.min.toString());
        queryParams.append('maxPrice', pagination.priceRange.max.toString());
      }
      
      const data = await apiFetch<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
      setProducts(data.data);
      setTotalProducts(data.total);
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить товары');
    } finally {
      setIsLoading(false);
    }
  }

  const setSearch = (search: string) => {
    setPagination({ ...pagination, search, page: 0 }); // Сбрасываем на первую страницу при поиске
  };

  const setCategory = (category: string) => {
    setPagination({ ...pagination, category, page: 0 }); // Сбрасываем на первую страницу при выборе категории
  };

  const setPriceRange = (range: { min: number; max: number }) => {
    setPagination({ ...pagination, priceRange: range, page: 0 }); // Сбрасываем на первую страницу при изменении диапазона цен
  };

  const setPage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const setLimit = (limit: number) => {
    setPagination({ ...pagination, limit, page: 0 }); // Сбрасываем на первую страницу при смене лимита
  };

  const pageCount = Math.ceil(totalProducts / pagination.limit);

  return { 
    products, 
    isLoading, 
    error,
    pagination, 
    pageCount,
    totalProducts,
    setSearch,
    setPage,
    setLimit,
    setCategory,
    setPriceRange
  };
}
