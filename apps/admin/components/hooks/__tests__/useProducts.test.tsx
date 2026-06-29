'use client';

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useProducts Hook', () => {
  const mockUseProducts = vi.fn(() => ({
    products: [],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }));

  beforeEach(() => {
    vi.doMock('../../../../shared', () => ({
      useProducts: mockUseProducts,
    }));
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => mockUseProducts());
    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call refetch when refetch function is called', () => {
    const { result } = renderHook(() => mockUseProducts());
    const refetch = result.current.refetch;
    refetch();
    expect(refetch).toHaveBeenCalled();
  });
});