import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading = ({ size = 'md', className }: LoadingProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader2 className={cn('animate-spin text-primary-600', sizes[size], className)} />
  );
};

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = '読み込み中...' }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loading size="lg" />
      <p className="text-secondary-500 text-sm">{message}</p>
    </div>
  );
};

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  isLoading,
  message = '処理中...',
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-secondary-600 font-medium">{message}</p>
      </div>
    </div>
  );
};
