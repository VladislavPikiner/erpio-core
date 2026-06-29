'use client';

import { useCart } from '../store/useCart';
import { useProducts } from '../hooks/useProducts';

export default function ProductGrid() {
  const { products, isLoading, error } = useProducts();
  const addItem = useCart((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse">Загрузка товаров...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-zinc-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-zinc-700 transition-colors"
          onClick={() => addItem(product)}
        >
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-zinc-400 mb-2">{product.sku}</p>
          <p className="text-emerald-400 font-bold">{product.price.toFixed(2)} ₽</p>
        </div>
      ))}
      {products.length === 0 && (
        <p className="col-span-3 text-center text-zinc-500 py-10">Товары не найдены</p>
      )}
    </div>
  );
}
