'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { useCart, apiFetch } from '@erpio/shared';
import { CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Отправляем заказ на бэкенд
      await apiFetch('/sales', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
          total: total,
          customer: formData,
          paymentMethod: 'card',
        }),
      });

      setIsSuccess(true);
      clearCart();
      
      // Редирект на главную через 3 секунды
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      alert('Ошибка при оформлении заказа. Пожалуйста, проверьте данные.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Заказ оформлен!</h1>
        <p className="text-zinc-500 mb-8">Спасибо за покупку. Мы уже начали собирать ваш заказ.</p>
        <Button onClick={() => router.push('/')} className="accent-button">Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">Оформление заказа</h1>
          <p className="text-zinc-500">Пожалуйста, заполните данные для доставки</p>
        </header>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
              <Truck className="h-4 w-4" /> Контактные данные
            </div>
            <input
              required
              placeholder="Ваше имя"
              className="w-full p-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              required
              placeholder="Телефон"
              className="w-full p-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <textarea
              required
              placeholder="Адрес доставки"
              className="w-full p-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
              <CreditCard className="h-4 w-4" /> Способ оплаты
            </div>
            <div className="p-4 border-2 border-emerald-600 bg-emerald-50 rounded-lg flex items-center justify-between">
              <span className="font-medium">Банковская карта (Онлайн)</span>
              <div className="h-4 w-4 bg-emerald-600 rounded-full" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isProcessing || items.length === 0}
            className="w-full accent-button py-4 text-lg"
          >
            {isProcessing ? 'Обработка...' : `Оплатить ${total.toFixed(2)} ₽`}
          </Button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm h-fit sticky top-8">
        <h2 className="text-xl font-bold mb-6">Сводка заказа</h2>
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-zinc-600">{item.name} x{item.quantity}</span>
              <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₽</span>
            </div>
          ))}
          <div className="border-t border-zinc-200 pt-4 flex justify-between font-bold text-xl">
            <span>Итого:</span>
            <span className="text-emerald-600">{total.toFixed(2)} ₽</span>
          </div>
        </div>
        <p className="text-xs text-zinc-400 text-center">
          Нажимая кнопку оплаты, вы соглашаетесь с условиями оферты магазина.
        </p>
      </div>
    </div>
  );
}
