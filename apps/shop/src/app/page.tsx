

import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Используем Shadcn Button
import { useProducts } from '@/hooks/useProducts'; // Хук для получения товаров
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
        <nav className="flex items-center space-x-6">
          <Link href="/products" className="text-zinc-700 hover:text-emerald-600 transition-colors">
            Каталог
          </Link>
          <Link href="/cart" className="text-zinc-700 hover:text-emerald-600 transition-colors flex items-center gap-1">
            <ShoppingCart className="h-5 w-5" /> Корзина
          </Link>
          <Link href="/login" className="text-zinc-700 hover:text-emerald-600 transition-colors flex items-center gap-1">
            <User className="h-5 w-5" /> Войти
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl font-extrabold mb-4 text-zinc-900 max-w-3xl leading-tight">
          Лучшие товары <span className="text-emerald-600">для вас</span>
        </h1>
        <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
          Откройте для себя наш широкий ассортимент продукции, легко оформляйте заказы и управляйте своей программой лояльности.
        </p>
        <div className="flex space-x-4">
          <Link href="/products">
            <Button className="accent-button text-lg px-8 py-4">Перейти в каталог</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="text-lg px-8 py-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
              Личный кабинет
            </Button>
          </Link>
        </div>
      </main>

      <footer className="p-6 border-t border-zinc-200 mt-auto text-center text-zinc-500">
        © 2026 Erpio Shop. Все права защищены.
      </footer>
    </div>
  );
}
