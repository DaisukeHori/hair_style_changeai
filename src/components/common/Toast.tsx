import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/stores';
import { cn } from '@/utils/cn';
import type { ToastMessage } from '@/types';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right fade-in duration-300',
        styles[toast.type]
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{toast.title}</p>
        {toast.message && (
          <p className="text-sm mt-0.5 opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
