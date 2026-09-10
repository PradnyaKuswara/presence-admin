import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(type: ToastType, message: string, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toastItem: ToastItem = { id, type, message, duration };
    this.toasts = [...this.toasts, toastItem];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  success(message: string, duration?: number) {
    return this.add('success', message, duration);
  }

  error(message: string, duration?: number) {
    return this.add('error', message, duration);
  }

  info(message: string, duration?: number) {
    return this.add('info', message, duration);
  }

  warning(message: string, duration?: number) {
    return this.add('warning', message, duration);
  }
}

export const toast = new ToastManager();

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => toast.dismiss(id),
    clear: () => toast.clear(),
  };
}

export default useToast;
