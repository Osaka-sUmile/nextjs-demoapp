'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SatisfactionDisplay } from '@/components/features/satisfaction-display';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Record } from '@/types';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function RecordDetailPage() {
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  // memoフィールドをパースしてthingsDoneとthingsNotDoneを取得する関数
  const parseMemo = (memo: string) => {
    // 新形式「できたこと」「できなかったこと」をまずチェック
    let parts = memo.split('\n\nできなかったこと: ');
    if (parts.length === 2) {
      return {
        thingsDone: parts[0].replace('できたこと: ', ''),
        thingsNotDone: parts[1]
      };
    }
    
    // 旧形式「やったこと」「やらなかったこと」もサポート
    parts = memo.split('\n\nやらなかったこと: ');
    if (parts.length === 2) {
      return {
        thingsDone: parts[0].replace('やったこと: ', ''),
        thingsNotDone: parts[1]
      };
    }
    
    return {
      thingsDone: memo,
      thingsNotDone: ''
    };
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        console.log('Fetching record with ID:', recordId);
        
        // 現在のユーザー情報を確認
        try {
          const authResponse = await api.checkAuth();
          console.log('Current user:', authResponse);
        } catch (authErr) {
          console.error('Auth check failed:', authErr);
        }
        
        const response = await api.getRecord(parseInt(recordId));
        console.log('Record API response:', response);
        console.log('Record data:', response.data);
        
        if (response.data) {
          setRecord(response.data);
          console.log('Record set successfully:', response.data);
        } else {
          console.warn('No data in response:', response);
          setRecord(null);
        }
      } catch (err) {
        console.error('Failed to fetch record:', err);
        setError('記録の取得に失敗しました');
        // デモ用のダミーデータ
        setRecord({
          id: parseInt(recordId),
          user: 1,
          date: '2024-01-15',
          memo: 'できたこと: プロジェクトの第1フェーズを完了した。チームメンバーとの協力により、予定より早く進捗することができた。\n\nできなかったこと: 時間管理が少し甘く、一部のタスクが翌日に持ち越しになってしまった。もう少し計画的に進めたかった。',
          satisfaction_level: 4,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        });
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const handleDelete = async () => {
    if (!record) return;
    
    const confirmed = window.confirm('この記録を削除してもよろしいですか？');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.deleteRecord(record.id);
      router.push('/records');
    } catch (err) {
      alert('記録の削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="記録詳細" showLogout={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="記録詳細" showLogout={true} />
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">記録が見つかりませんでした</p>
              <Link href="/records">
                <Button variant="outline">
                  記録一覧に戻る
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="記録詳細" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-orange-200 bg-orange-50 mb-4 max-w-2xl mx-auto">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                {error} (デモデータを表示中)
              </p>
            </CardContent>
          </Card>
        )}

        {/* 戻るボタン */}
        <div className="mb-4 max-w-2xl mx-auto">
          <Link href="/records">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              記録一覧に戻る
            </Button>
          </Link>
        </div>

        {/* 記録詳細 */}
        <Card className="max-w-2xl mx-auto border-orange-200 bg-white/95">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-orange-600">
                  {formatDate(record.date)}
                </CardTitle>
                <div className="mt-2">
                  <SatisfactionDisplay 
                    level={record.satisfaction_level}
                    showLabel={true}
                    size="lg"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/records/${record.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    編集
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {deleting ? '削除中...' : '削除'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* できたこと */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                できたこと
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {record.memo ? parseMemo(record.memo).thingsDone || '記録なし' : '記録なし'}
                </p>
              </div>
            </div>

            {/* できなかったこと */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-orange-500 mr-2">△</span>
                できなかったこと
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {record.memo ? parseMemo(record.memo).thingsNotDone || '記録なし' : '記録なし'}
                </p>
              </div>
            </div>

            {/* メタ情報 */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>作成日時: {new Date(record.created_at).toLocaleString('ja-JP')}</p>
                <p>更新日時: {new Date(record.updated_at).toLocaleString('ja-JP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="max-w-2xl mx-auto mt-6 flex justify-center space-x-4">
          <Link href={`/records/${record.id}/edit`}>
            <Button variant="outline" className="min-w-[120px]">
              <Edit className="h-4 w-4 mr-2" />
              編集する
            </Button>
          </Link>
          <Link href="/records/new">
            <Button className="min-w-[120px]">
              新しい記録を作成
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
