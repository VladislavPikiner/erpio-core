'use client';

import { useState } from 'react';
import { apiFetch } from '@erpio/shared';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.push('/');
    } catch (e) {
      alert('Ошибка входа');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-emerald-500">Вход в POS</h1>
        <input 
            type="email" placeholder="Email" className="w-full p-3 mb-4 bg-zinc-800 rounded"
            value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input 
            type="password" placeholder="Пароль" className="w-full p-3 mb-6 bg-zinc-800 rounded"
            value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-emerald-600 py-3 rounded font-bold">Войти</button>
      </form>
    </div>
  );
}
