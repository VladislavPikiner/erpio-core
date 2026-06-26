"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo, _: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-red-200 bg-red-50 rounded-xl">
          <h2 className="text-xl font-bold text-red-600 mb-2">Что-то пошло не так</h2>
          <p className="text-zinc-600 mb-4">Произошла непредвиденная ошибка. Пожалуйста, обновите страницу.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
