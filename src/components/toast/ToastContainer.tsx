import React from 'react';
import { useToast, type ToastItem, type ToastType } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastStyleConfig: Record<
  ToastType,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/90',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    text: 'text-emerald-900 dark:text-emerald-100',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/90',
    border: 'border-rose-200 dark:border-rose-800/80',
    text: 'text-rose-900 dark:text-rose-100',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/90',
    border: 'border-amber-200 dark:border-amber-800/80',
    text: 'text-amber-900 dark:text-amber-100',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800/80',
    text: 'text-blue-900 dark:text-blue-100',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
  },
};

export const ToastItemComponent: React.FC<{
  item: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ item, onDismiss }) => {
  const config = toastStyleConfig[item.type] || toastStyleConfig.info;

  return (
    <div
      className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} ${config.text} shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 z-50 min-w-70 max-w-md`}
      role="alert"
    >
      {config.icon}
      <div className="flex-1 text-sm font-medium pr-2 wrap-break-word">
        {item.message}
      </div>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-9999 flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItemComponent key={t.id} item={t} onDismiss={dismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
