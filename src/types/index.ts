// User types
export interface User {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user?: User;
  message?: string;
}

// Record types
export interface Record {
  id: number;
  user: number;
  date: string;
  satisfaction_level: number; // 0-5
  memo: string;
  created_at: string;
  updated_at: string;
}

export interface RecordListItem {
  id: number;
  date: string;
  satisfaction_level: number;
  satisfaction_display: string;
  memo: string;
  created_at: string;
  updated_at: string;
  user_email: string;
}

export interface CreateRecordRequest {
  date: string;
  satisfaction_level: number;
  memo: string;
}

export interface UpdateRecordRequest {
  date: string;
  satisfaction_level: number;
  memo: string;
}

// Home data types
export interface HomeData {
  averageSatisfaction: number;
  yesterdaySatisfaction: number | null;
  consecutiveDays: number;
}

// Ranking types
export interface RankingItem {
  id: number;
  rank: number;
  username: string;
  email: string;
  totalSatisfaction: number;
  averageSatisfaction: number;
  totalRecords: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  // ページネーション情報
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Satisfaction levels (0-4)
export const SATISFACTION_LEVELS = [
  { value: 0, label: '最悪', emoji: '😣' },
  { value: 1, label: '悪い', emoji: '😞' },
  { value: 2, label: '普通', emoji: '😐' },
  { value: 3, label: '良い', emoji: '😊' },
  { value: 4, label: '最高', emoji: '😄' },
] as const;

export type SatisfactionLevel = typeof SATISFACTION_LEVELS[number]['value'];
