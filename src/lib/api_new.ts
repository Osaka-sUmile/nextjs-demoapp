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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // 認証関連のAPI
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<void>('/users/logout/', {
      method: 'POST',
    });
  }

  async checkAuth(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/check-auth/');
  }

  // 記録関連のAPI
  async getRecords(): Promise<ApiResponse<RecordListItem[]>> {
    return this.request<ApiResponse<RecordListItem[]>>('/records/');
  }

  async getRecord(id: number): Promise<ApiResponse<Record>> {
    return this.request<ApiResponse<Record>>(`/records/${id}/`);
  }

  async createRecord(data: CreateRecordRequest): Promise<ApiResponse<Record>> {
    return this.request<ApiResponse<Record>>('/records/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecord(id: number, data: UpdateRecordRequest): Promise<ApiResponse<Record>> {
    return this.request<ApiResponse<Record>>(`/records/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRecord(id: number): Promise<void> {
    await this.request<void>(`/records/${id}/`, {
      method: 'DELETE',
    });
  }

  // ダッシュボード用のAPI
  async getHomeData(): Promise<ApiResponse<HomeData>> {
    return this.request<ApiResponse<HomeData>>('/records/home/');
  }

  // ランキング用のAPI
  async getRanking(): Promise<ApiResponse<RankingItem[]>> {
    return this.request<ApiResponse<RankingItem[]>>('/records/ranking/');
  }
}

export const api = new ApiClient();
