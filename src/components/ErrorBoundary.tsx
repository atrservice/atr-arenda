// ========================================
// File: src/components/ErrorBoundary.tsx
// Description: Обработка ошибок рендеринга для мобильных устройств
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем ошибку в консоль (для отладки)
    console.error('🔴 Uncaught error:', error, errorInfo);
    
    // Опционально: отправь ошибку в сервис мониторинга (Sentry, и т.д.)
    // if (process.env.NODE_ENV === 'production') {
    //   sendErrorToMonitoring(error, errorInfo);
    // }
  }

  public render() {
    if (this.state.hasError) {
      // Показываем фолбэк вместо белого экрана
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-4">
              Попробуйте обновить страницу или зайти позже.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Обновить страницу
            </button>
            {/* Для отладки: раскомментируй, чтобы видеть ошибку на экране */}
            {/* <pre className="text-xs text-red-500 mt-4 overflow-auto">
              {this.state.error?.toString()}
            </pre> */}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}