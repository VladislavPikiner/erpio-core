import { useState } from 'react';
'use client';

import { useCart } from '../store/useCart';
import { apiFetch } from '@erpio/shared';

export default function CheckoutPanel() {
  const { items, removeItem, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Функция оплаты
  const handlePayment = async () => {
    if (items.length === 0) return; // Нечего оплачивать

    try {
      // Отправляем заказ на бэкенд
      await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
          total: total,
          // Здесь можно добавить branchId, userId если они доступны в сторе
        }),
      });
      
      alert('Оплата прошла успешно!'); // Пока заглушка
      clearCart(); // Очищаем корзину после успешной оплаты

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Произошла ошибка при оплате. Попробуйте позже.');
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-inner h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>
      {items.length === 0 ? (
        <p className="text-zinc-500 flex-grow flex items-center justify-center">Корзина пуста</p>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-zinc-700 last:border-b-0">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-zinc-400 text-sm">{item.quantity} x {item.price.toFixed(2)} ₽</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="font-bold text-emerald-400">{(item.price * item.quantity).toFixed(2)} ₽</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove item"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-auto pt-4 border-t border-zinc-700">
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>Итого:</span>
          <span>{total.toFixed(2)} ₽</span>
        </div>
        <button
          onClick={clearCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={items.length === 0}
        >
          Очистить корзину
        </button>
        <button
          onClick={handlePayment} // Добавляем обработчик
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={items.length === 0}
        >
          Оплатить
        </button>
      </div>
    </div>
  );
}
