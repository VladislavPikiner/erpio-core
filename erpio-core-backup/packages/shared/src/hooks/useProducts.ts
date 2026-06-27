"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api';
import { Product, PaginationParams, PaginatedResponse } from '../schemas';
import { ProductSchema, PaginatedResponseSchema } from '../schemas';

// Добавляем category и price к PaginationParams
interface ExtendedPaginationParams extends PaginationParams {
  search?: string;
  category?: string;
  priceRange?: { min: number; max: number };
}

export function useProducts() {
  const [pagination, setPagination] = useState<ExtendedPaginationParams>({ page: 0, limit: 10 });

  const fetchProducts = async () => {
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

    const response = await apiFetch<any>(`/products?${queryParams.toString()}`);
    const validatedData = PaginatedResponseSchema(ProductSchema).parse(response);
    return validatedData; // Возвращаем данные для useQuery
  };

  const { 
    data,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['products', pagination], // Ключ запроса, чтобы React Query знал, когда его перезапрашивать
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 минут кэширования
    retry: 1,
  });

  const products = data?.data || [];
  const totalProducts = data?.total || 0;
  const pageCount = Math.ceil(totalProducts / pagination.limit);

  const setSearch = (search: string) => {
    setPagination({ ...pagination, search, page: 0 });
  };

  const setCategory = (category: string) => {
    setPagination({ ...pagination, category, page: 0 });
  };

  const setPriceRange = (range: { min: number; max: number }) => {
    setPagination({ ...pagination, priceRange: range, page: 0 });
  };

  const setPage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const setLimit = (limit: number) => {
    setPagination({ ...pagination, limit, page: 0 });
  };

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
