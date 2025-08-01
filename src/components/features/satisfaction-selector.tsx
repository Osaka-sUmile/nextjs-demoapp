'use client';

import { SATISFACTION_LEVELS } from '@/types';
import { cn } from '@/lib/utils';

interface SatisfactionSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SatisfactionSelector({
  value,
  onChange,
  className
}: SatisfactionSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-gray-700">
        満足度 (0-5)
      </label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SATISFACTION_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 transition-all",
              value === level.value
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50"
            )}
          >
            <span className="text-2xl mb-1">{level.emoji}</span>
            <span className="text-xs font-medium">{level.value}</span>
            <span className="text-xs">{level.label}</span>
          </button>
        ))}
      </div>
      <div className="text-center">
        <span className="text-sm text-gray-600">
          選択中: {value} - {SATISFACTION_LEVELS.find(l => l.value === value)?.label}
        </span>
      </div>
    </div>
  );
}
