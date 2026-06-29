import React from 'react';
import { X } from 'lucide-react'; // Для кнопки закрытия
import { Product } from '@erpio/shared'; // Предполагаемый тип товара

interface CartItem extends Product {
  quantity: number;
}

interface SlideOverCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
}

export const SlideOverCart = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }: SlideOverCartProps) => {
  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-y-0 right-0 pl-10 max-w-full flex"
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
                <h2 id="slide-over-title" className="text-lg font-medium text-zinc-900">
                  Корзина ({totalItems} шт.)
                </h2>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-center text-zinc-500">Ваша корзина пуста.</p>
                ) : (
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-100">
                        <div className="flex items-center">
                          <img src={item.imageUrl || '/placeholder.png'} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                          <div>
                            <p className="font-medium text-sm text-zinc-900">{item.name}</p>
                            <p className="text-xs text-zinc-500">{item.sku}</p>
                            <p className="text-sm font-semibold text-emerald-700">{(item.price * item.quantity).toFixed(2)} ₽</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 border rounded text-sm hover:bg-zinc-50 disabled:opacity-50"
                          >-</button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                            className="px-2 py-1 border rounded text-sm hover:bg-zinc-50"
                          >+</button>
                          <button onClick={() => onRemoveItem(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="px-4 py-6 border-t border-zinc-200">
                <div className="flex justify-between font-medium text-lg mb-4">
                  <span>Итого:</span>
                  <span>{totalPrice.toFixed(2)} ₽</span>
                </div>
                <button 
                  onClick={onCheckout} 
                  disabled={cartItems.length === 0}
                  className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
