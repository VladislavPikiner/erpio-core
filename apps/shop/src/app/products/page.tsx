'use client';

import { useProducts } from '@erpio/shared';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const { products, isLoading, error } = useProducts();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Наш ассортимент</h1>
        <p className="text-zinc-500">Выберите товары для покупки</p>
      </header>

      {isLoading ? (
        <p className="text-center py-20">Загрузка товаров...</p>
      ) : error ? (
        <p className="text-center py-20 text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
