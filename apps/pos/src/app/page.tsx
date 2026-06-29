'use client';

import ProductGrid from '../components/ProductGrid';
import CheckoutPanel from '../components/CheckoutPanel';

export default function Page() {
  return (
    <main className="h-screen flex gap-6 p-6 overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-500">POS Система</h1>
          <p className="text-zinc-400">Выберите товары для оформления заказа</p>
        </header>
        <ProductGrid />
      </div>
      <div className="w-96 shrink-0">
        <CheckoutPanel />
      </div>
    </main>
  );
}
