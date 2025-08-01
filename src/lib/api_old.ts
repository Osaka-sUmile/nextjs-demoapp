import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Record,
  RecordListItem,
  CreateRecordRequest,
  UpdateRecordRequest,
  HomeData,
  RankingItem,
  ApiResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      ...(options.headers as { [key: string]: string }),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // セッション認証のためにクッキーを含める
    });

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = tokenStorage.get();

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      ...(options.headers as { [key: string]: string }),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async checkAuth(): Promise<{ isAuthenticated: boolean; user: any }> {
    return this.request<{ isAuthenticated: boolean; user: any }>('/auth/check-auth/');
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout/', {
      method: 'POST',
    });
  }

  // Records API
  async getRecords(params?: { dateFrom?: string; dateTo?: string }): Promise<RecordListItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('date_from', params.dateFrom);
    if (params?.dateTo) searchParams.set('date_to', params.dateTo);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/records/?${queryString}` : '/records/';
    
    return this.request<RecordListItem[]>(endpoint);
  }

  async getRecord(id: number): Promise<Record> {
    return this.request<Record>(`/records/${id}/`);
  }

  async createRecord(record: CreateRecordRequest): Promise<{ message: string; id: number }> {
    const response = await this.request<any>('/records/', {
      method: 'POST',
      body: JSON.stringify({
        date: record.date,
        memo: record.thingsDone + (record.thingsNotDone ? '\n' + record.thingsNotDone : ''),
        satisfaction_level: record.satisfaction,
      }),
    });
    
    return {
      message: '記録を作成しました',
      id: response.id
    };
  }

  async updateRecord(id: number, record: UpdateRecordRequest): Promise<{ message: string }> {
    await this.request<any>(`/records/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        date: record.date,
        memo: record.thingsDone + (record.thingsNotDone ? '\n' + record.thingsNotDone : ''),
        satisfaction_level: record.satisfaction,
      }),
    });
    
    return { message: '記録を更新しました' };
  }

  async deleteRecord(id: number): Promise<void> {
    await this.request(`/records/${id}/`, {
      method: 'DELETE',
    });
  }

  // Home data API
  async getHomeData(): Promise<HomeData> {
    const response = await this.request<{
      totalRecords: number;
      averageSatisfaction: number;
      recentRecords: any[];
      weeklyTrend: any[];
    }>('/records/home-stats/');

    return {
      averageSatisfaction: response.averageSatisfaction,
      yesterdaySatisfaction: null, // バックエンドから提供されないため
      consecutiveDays: response.totalRecords, // 代替として総記録数を使用
    };
  }

  // Ranking API
  async getRanking(): Promise<RankingItem[]> {
    const response = await this.request<{
      satisfactionDistribution: { [key: string]: number };
      monthlyAverage: { [key: string]: number };
      totalRecords: number;
    }>('/records/ranking/');

    // ランキング形式に変換（現在は分布データのみ）
    return Object.entries(response.satisfactionDistribution).map(([level, count], index) => ({
      rank: index + 1,
      username: `Level ${level}`,
      totalSatisfactionPoints: count,
    }));
  }
}

export const api = new ApiClient();
