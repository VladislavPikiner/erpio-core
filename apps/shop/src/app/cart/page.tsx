'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { useCart } from '@erpio/shared';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ваша Корзина</h1>
          <p className="text-zinc-500">Проверьте ваш заказ</p>
        </div>
        {items.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearCart} 
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Очистить
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-medium mb-4">Ваша корзина пуста</p>
          <p className="text-zinc-500 mb-6">Но это легко исправить!</p>
          <Link href="/products">
            <Button className="accent-button">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50 transition-colors">
              <div className="flex-grow">
                <p className="font-semibold text-zinc-900">{item.name}</p>
                <p className="text-sm text-zinc-500">SKU: {item.sku}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-zinc-300 rounded bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-lg font-bold hover:bg-zinc-100 disabled:text-zinc-400"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-lg font-bold hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-emerald-600 text-lg w-24 text-right">
                  {(item.price * item.quantity).toFixed(2)} ₽
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 p-6 bg-white shadow-md rounded-lg border border-zinc-200">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Итого:</span>
            <span>{total.toFixed(2)} ₽</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full accent-button py-3 text-lg">Оформить заказ</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
