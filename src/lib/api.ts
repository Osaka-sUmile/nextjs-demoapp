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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api';

class ApiClient {
  // CSRFトークンをクッキーから取得
  private getCSRFToken(): string | null {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // CSRFトークンを取得するためのリクエスト
  private async ensureCSRFToken(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/csrf/`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', { url, options });

    // POST/PUT/DELETE等の場合、CSRFトークンを確保
    if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      await this.ensureCSRFToken();
    }

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      ...(options.headers as { [key: string]: string }),
    };

    // CSRFトークンをヘッダーに追加
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // セッション認証のためにクッキーを含める
    });

    console.log('API Response:', { status: response.status, ok: response.ok });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Text:', errorText);
      
      // IntegrityErrorをチェック
      if (errorText.includes('IntegrityError') && errorText.includes('UNIQUE constraint failed')) {
        throw new Error('IntegrityError: Record already exists for this date');
      }
      
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // 認証関連のAPI
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout/', {
      method: 'POST',
    });
  }

  async checkAuth(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/check-auth/');
  }

  // 記録関連のAPI
  async getRecords(): Promise<ApiResponse<RecordListItem[]>> {
    const response = await this.request<any>('/records/');
    
    // ページネーション形式のレスポンスを処理
    if (response.results) {
      return {
        data: response.results,
        count: response.count,
        next: response.next,
        previous: response.previous
      };
    }
    
    // ページネーションなしの場合
    return { data: response };
  }

  async getRecord(id: number): Promise<ApiResponse<Record>> {
    const response = await this.request<Record>(`/records/${id}/`);
    
    // バックエンドは直接レコードデータを返すため、ApiResponse形式にラップ
    return { data: response };
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
    console.log('Making request to /records/home-stats/');
    const response = await this.request<HomeData>('/records/home-stats/');
    console.log('getHomeData response:', response);
    
    // バックエンドは直接データを返すため、ApiResponse形式にラップ
    return { data: response };
  }

  // ランキング用のAPI
  async getRanking(): Promise<ApiResponse<RankingItem[]>> {
    return this.request<ApiResponse<RankingItem[]>>('/records/ranking/');
  }
}

export const api = new ApiClient();
