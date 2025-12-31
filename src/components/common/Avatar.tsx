import { cn } from '@/utils/cn';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar = ({ src, name, size = 'md', className }: AvatarProps) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium uppercase',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};
