
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui";
import { Input } from "@repo/ui";
import { useProducts, Product, useCart, ToastProvider, useToast, ErrorBoundary } from '@erpio/shared';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { DataTable } from "@repo/ui";
import { ShoppingCart } from 'lucide-react';
import { ProductFilters } from '../../components/ProductFilters'; 
import { SlideOverCart } from '../../components/ui/SlideOverCart';

export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    pagination,
    setPage,
    setSearch,
    setCategory,
    setPriceRange,
  } = useProducts();

  const { toast } = useToast();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCart();

  const addToCart = (product: Product) => {
    addItem(product);
    toast.success('Товар добавлен в корзину!');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const removeCartItem = (id: string) => {
    removeItem(id);
    toast.success('Товар удален из корзины');
  };

  const checkout = () => {
    toast.info('Переходим к оформлению заказа...');
    setIsCartOpen(false);
  };

  const handleFilterChange = () => {
    setPage(0); 
  };

  return (
    <ToastProvider>
      <div className="flex p-8 max-w-6xl mx-auto">
          <ProductFilters 
            onCategoryChange={(cat) => {
              setCategory(cat);
              handleFilterChange();
            }} 
            onPriceChange={(range) => {
              setPriceRange(range);
              handleFilterChange();
            }} 
          />
          <main className="flex-1 ml-8">
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Наш ассортимент</h1>
                <p className="text-zinc-500">Выберите товары для покупки</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-3 bg-white border border-zinc-200 rounded-full shadow-sm hover:bg-zinc-50 relative"
              >
                <ShoppingCart className="h-6 w-6 text-zinc-700" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </header>

            <div className="mb-4 flex items-center justify-between">
              <Input 
                placeholder="Поиск товаров..." 
                value={pagination.search || ''}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-40 bg-zinc-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <p className="text-center py-20 text-red-500">{typeof error === 'string' ? error : (error as Error).message}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-white p-4 rounded-lg shadow">
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-500">{product.price} ₽</p>
                        <button onClick={() => addToCart(product)} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">Добавить в корзину</button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
        <SlideOverCart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={removeCartItem}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={checkout}
        />
      </ToastProvider>
  );
}
