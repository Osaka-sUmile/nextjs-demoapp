import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日付フォーマット関数
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function formatDateForInput(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// 満足度に基づく画像ファイル名を取得
export function getSatisfactionImagePath(averageSatisfaction: number): string {
  const level = Math.round(averageSatisfaction);
  return `/images/fig${level}.jpg`;
}

// APIエラーハンドリング
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'エラーが発生しました';
}

// ローカルストレージのトークン管理
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }
};

// 満足度レベルの説明を取得
export function getSatisfactionLabel(level: number): string {
  const labels = {
    0: '最悪',
    1: '悪い',
    2: 'まあまあ',
    3: '普通',
    4: '良い',
    5: '最高'
  };
  return labels[level as keyof typeof labels] || '不明';
}

// 満足度レベルの絵文字を取得
export function getSatisfactionEmoji(level: number): string {
  const emojis = {
    0: '😣',
    1: '😞',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '😄'
  };
  return emojis[level as keyof typeof emojis] || '❓';
}
