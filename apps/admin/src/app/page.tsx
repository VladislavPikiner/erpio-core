'use client';

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProducts, Product } from '@erpio/shared';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from "../components/ui/data-table";
import { LayoutDashboard, Package, TrendingUp, ShoppingCart } from 'lucide-react';

// Mock data for the chart - будет заменен на реальные данные с бэкенда
const chartData = [
  { name: 'Пн', sales: 4000 },
  { name: 'Вт', sales: 3000 },
  { name: 'Ср', sales: 2000 },
  { name: 'Чт', sales: 2780 },
  { name: 'Пт', sales: 1890 },
  { name: 'Сб', sales: 2390 },
  { name: 'Вс', sales: 3390 },
];

// Определение колонок для таблицы товаров
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

export default function AdminDashboard() {
  const { products, isLoading, error } = useProducts();

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
        <div className="bg-white p-2 rounded-lg shadow-sm border border-zinc-200 text-sm font-medium">
          Филиал: Москва Центр
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Общая выручка</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124,500 ₽</div>
            <p className="text-xs text-emerald-600">+12% за неделю</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Всего продаж</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-zinc-500">Средний чек: 364 ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Ассортимент</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-zinc-500">Активных позиций</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Динамика выручки (нед)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Управление товарами</h2>
          {isLoading ? (
            <p className="text-zinc-500">Загрузка...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length > 0 ? (
            <DataTable columns={productColumns} data={products} />
          ) : (
            <p className="text-zinc-500">Нет товаров</p>
          )}
        </div>
      </div>
    </div>
  );
}
