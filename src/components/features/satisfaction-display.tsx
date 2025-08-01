import { getSatisfactionEmoji, getSatisfactionLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SatisfactionDisplayProps {
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SatisfactionDisplay({
  level,
  showLabel = true,
  size = 'md',
  className
}: SatisfactionDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const emojiSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className={emojiSizeClasses[size]}>
        {getSatisfactionEmoji(level)}
      </span>
      {showLabel && (
        <span className={cn("font-medium", sizeClasses[size])}>
          {level} - {getSatisfactionLabel(level)}
        </span>
      )}
      {!showLabel && (
        <span className={cn("font-medium", sizeClasses[size])}>
          {level}
        </span>
      )}
    </div>
  );
}
