'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SatisfactionDisplay } from '@/components/features/satisfaction-display';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { RecordListItem } from '@/types';
import { Plus } from 'lucide-react';

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // memoからタイトルを生成する関数
  const generateTitle = (memo: string) => {
    if (!memo) return '記録詳細';
    
    // 新形式「できたこと」「できなかったこと」をまずチェック
    let parts = memo.split('\n\nできなかったこと: ');
    if (parts.length === 2) {
      const thingsDone = parts[0].replace('できたこと: ', '');
      return thingsDone.length > 30 ? thingsDone.substring(0, 30) + '...' : thingsDone;
    }
    
    // 旧形式「やったこと」「やらなかったこと」もサポート
    parts = memo.split('\n\nやらなかったこと: ');
    if (parts.length === 2) {
      const thingsDone = parts[0].replace('やったこと: ', '');
      return thingsDone.length > 30 ? thingsDone.substring(0, 30) + '...' : thingsDone;
    }
    
    return memo.length > 30 ? memo.substring(0, 30) + '...' : memo;
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        console.log('Fetching records...');
        
        // 現在のユーザー情報を確認
        try {
          const authResponse = await api.checkAuth();
          console.log('Current user:', authResponse);
        } catch (authErr) {
          console.error('Auth check failed:', authErr);
        }
        
        const response = await api.getRecords();
        console.log('Records API response:', response);
        console.log('Records data:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setRecords(response.data);
          console.log('Records set:', response.data);
        } else {
          console.warn('Invalid response format:', response);
          setRecords([]);
        }
      } catch (err) {
        console.error('Failed to fetch records:', err);
        setError('記録の取得に失敗しました');
        // デモ用のダミーデータ
        setRecords([
          {
            id: 1,
            date: '2024-01-15',
            satisfaction_level: 3, // 0-4スケール
            satisfaction_display: '良い',
            memo: 'できたこと: プロジェクト完了\n\nできなかったこと: 時間管理が甘かった',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            user_email: 'test@example.com'
          },
          {
            id: 2,
            date: '2024-01-14',
            satisfaction_level: 2, // 0-4スケール
            satisfaction_display: '普通',
            memo: 'できたこと: 通常の一日\n\nできなかったこと: 特になし',
            created_at: '2024-01-14T10:00:00Z',
            updated_at: '2024-01-14T10:00:00Z',
            user_email: 'test@example.com'
          },
          {
            id: 3,
            date: '2024-01-13',
            satisfaction_level: 4, // 0-4スケール
            satisfaction_display: '最高',
            memo: 'できたこと: 素晴らしい成果\n\nできなかったこと: なし',
            created_at: '2024-01-13T10:00:00Z',
            updated_at: '2024-01-13T10:00:00Z',
            user_email: 'test@example.com'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="記録一覧" showLogout={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="記録一覧" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-orange-200 bg-orange-50 mb-4">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                {error} (デモデータを表示中)
              </p>
            </CardContent>
          </Card>
        )}

        {/* 新規記録ボタン */}
        <div className="mb-6">
          <Link href="/records/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              新しい記録を作成
            </Button>
          </Link>
        </div>

        {/* 記録一覧 */}
        {records.length === 0 ? (
          <Card className="border-orange-200 bg-white/90">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-4">
                まだ記録がありません
              </div>
              <p className="text-gray-600 mb-6">
                日々の満足度を記録して、自己成長を振り返りましょう
              </p>
              <Link href="/records/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  最初の記録を作成
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <Link key={record.id} href={`/records/${record.id}`}>
                <Card className="border-orange-200 bg-white/90 hover:bg-white/95 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-800">
                            {formatDate(record.date)}
                          </span>
                          <SatisfactionDisplay 
                            level={record.satisfaction_level}
                            showLabel={false}
                            size="sm"
                          />
                        </div>
                        <p className="text-gray-600 text-sm">
                          {generateTitle(record.memo)}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <svg 
                          className="h-5 w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 統計情報 */}
        {records.length > 0 && (
          <Card className="border-orange-200 bg-white/90 mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">統計情報</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {records.length}
                  </div>
                  <div className="text-sm text-gray-600">総記録数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {records.length > 0 ? 
                      (records.reduce((sum, r) => sum + r.satisfaction_level, 0) / records.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className="text-sm text-gray-600">平均満足度</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
