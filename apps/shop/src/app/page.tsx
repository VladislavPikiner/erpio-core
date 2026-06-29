'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { useProducts } from '@erpio/shared';
import { ShoppingCart, Package, User } from 'lucide-react';

// TODO: Добавить AuthGuard, если пользователь должен быть авторизован для просмотра страницы
// TODO: Интегрировать реальные данные вместо моковых

export default function LandingPage() {
  const { products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="p-6 flex justify-between items-center shadow-sm border-b border-zinc-200 sticky top-0 z-50 bg-white">
        <Link href="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
          Erpio Shop
        </Link>
        <nav className="flex gap-4">
          <Link href="/products" className="flex items-center gap-2 text-zinc-600 hover:text-emerald-600">
            <Package size={20} />
            Товары
          </Link>
          <Link href="/cart" className="flex items-center gap-2 text-zinc-600 hover:text-emerald-600">
            <ShoppingCart size={20} />
            Корзина
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-8">Добро пожаловать в наш магазин</h1>
        {isLoading && <p>Загрузка товаров...</p>}
        {error && <p className="text-red-500">{typeof error === 'string' ? error : error.message || 'Произошла ошибка'}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-zinc-500">{product.price} ₽</p>
              <Button className="mt-4">Добавить в корзину</Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
