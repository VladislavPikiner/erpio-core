
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProducts, Product } from '@/shared';
import { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from "../components/ui/data-table";
import { LayoutDashboard, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { ToastProvider, useToast, ErrorBoundary } from '@/shared';

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
      return <button className="text-blue-500 hover:underline">Подробнее</button>;
    },
  },
];

function AdminDashboardContent() {
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    pageCount, 
    setPage,
    setSearch
  } = useProducts();

  const { toast } = useToast();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handlePaginationChange = (updater: (old: PaginationState) => PaginationState) => {
    const newState = typeof updater === 'function' ? updater({
      pageIndex: pagination.page,
      pageSize: pagination.limit
    }) : updater;
    setPage(newState.pageIndex);
  };

  const handleDeleteSelected = () => {
    toast.error(`Удалено ${Object.keys(rowSelection).length} товаров`);
    setRowSelection({});
  };

  return (
    <div className="p-8 bg-zinc-50 min-h-screen text-zinc-900">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" /> 
            Панель управления
          </h1>
          <p className="text-zinc-500">Аналитика и управление сетью магазинов</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Управление товарами</h2>
          
          <div className="mb-4 flex items-center justify-between">
            <Input 
              placeholder="Поиск товаров..." 
              value={pagination.search || ''}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            {Object.keys(rowSelection).length > 0 && (
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                onClick={handleDeleteSelected}
              >
                Удалить ({Object.keys(rowSelection).length})
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="text-zinc-500">Загрузка...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length > 0 ? (
            <DataTable 
              columns={productColumns} 
              data={products} 
              pageCount={pageCount}
              pagination={{
                pageIndex: pagination.page,
                pageSize: pagination.limit,
              }}
              onPaginationChange={handlePaginationChange}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          ) : (
            <p className="text-zinc-500">Нет товаров</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <AdminDashboardContent />
      </ErrorBoundary>
    </ToastProvider>
  );
}
