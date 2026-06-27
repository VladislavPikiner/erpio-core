import { describe, it, expect } from 'vitest';
import { ProductSchema } from './schemas';

describe('ProductSchema', () => {
  it('should validate a correct product object', () => {
    const validProduct = {
      id: 'prod-123',
      name: 'Test Product',
      price: 100,
      sku: 'SKU-001',
    };
    
    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validProduct);
    }
  });

  it('should fail validation if required fields are missing', () => {
    const invalidProduct = {
      id: 'prod-123',
      // name missing
      price: 100,
      sku: 'SKU-001',
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('should fail validation if price is not a number', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      price: '100', // string instead of number
      sku: 'SKU-001',
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});
