
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProducts, Product, useCart } from '@/shared';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { DataTable } from "../components/ui/data-table";
import { LayoutDashboard, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { ProductFilters } from '../components/ProductFilters'; // Импорт фильтров
import { SlideOverCart } from '../components/ui/SlideOverCart'; // Импорт корзины
import { ToastProvider, useToast, ErrorBoundary } from '@/shared'; // Импорт ToastProvider и useToast

// Mock data for the chart
const chartData = [
  { name: 'Пн', sales: 4000 },
  { name: 'Вт', sales: 3000 },
  { name: 'Ср', sales: 2000 },
  { name: 'Чт', sales: 2780 },
  { name: 'Пт', sales: 1890 },
  { name: 'Сб', sales: 2390 },
  { name: 'Вс', sales: 3390 },
];

const productColumns: ColumnDef<Product>[] = [
  {
    header: 'Название',
    accessorKey: 'name',
  },
  {
    header: 'SKU',
    accessorKey: 'sku',
  },
  {
    header: 'Цена',
    accessorKey: 'price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return `${price.toFixed(2)} ₽`;
    },
  },
  {
    header: 'Действия',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); } } 
          className="px-3 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600"
        >
          В корзину
        </button>
      );
    },
  },
];

export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    pagination,
    pageCount,
    setPage,
    setSearch,
    setCategory,
    setPriceRange,
  } = useProducts();

  const { toast } = useToast();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCart();

  const handlePaginationChange = (updater: (old: PaginationState) => PaginationState) => {
    const newState = typeof updater === 'function' ? updater({
      pageIndex: pagination.page,
      pageSize: pagination.limit
    }) : updater;
    setPage(newState.pageIndex);
  };

  const handleFilterChange = () => {
    setPage(0); // Сбрасываем на первую страницу при смене фильтра
  };

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

  return (
    <ToastProvider>
      <ErrorBoundary>
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
                  <SkeletonLoader key={index} />
                ))}
              </div>
            ) : error ? (
              <p className="text-center py-20 text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
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
      </ErrorBoundary>
    </ToastProvider>
  );
}
