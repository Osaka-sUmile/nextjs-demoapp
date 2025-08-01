'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SatisfactionSelector } from '@/components/features/satisfaction-selector';
import { api } from '@/lib/api';
import { formatDateForInput } from '@/lib/utils';
import { Record } from '@/types';

export default function EditRecordPage() {
  const [record, setRecord] = useState<Record | null>(null);
  const [date, setDate] = useState('');
  const [thingsDone, setThingsDone] = useState('');
  const [thingsNotDone, setThingsNotDone] = useState('');
  const [satisfaction, setSatisfaction] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await api.getRecord(parseInt(recordId));
        const data = response.data;
        if (data) {
          setRecord(data);
          setDate(formatDateForInput(data.date));
          
          // memoフィールドを解析してthingsDoneとthingsNotDoneに分割
          if (data.memo) {
            // 新形式「できたこと」「できなかったこと」をまずチェック
            let parts = data.memo.split('\n\nできなかったこと: ');
            if (parts.length === 2) {
              setThingsDone(parts[0].replace('できたこと: ', ''));
              setThingsNotDone(parts[1]);
            } else {
              // 旧形式「やったこと」「やらなかったこと」もサポート
              parts = data.memo.split('\n\nやらなかったこと: ');
              if (parts.length === 2) {
                setThingsDone(parts[0].replace('やったこと: ', ''));
                setThingsNotDone(parts[1]);
              } else {
                // 古い形式の場合はそのままmemoを使用
                setThingsDone(data.memo);
                setThingsNotDone('');
              }
            }
          } else {
            setThingsDone('');
            setThingsNotDone('');
          }
          
          // 満足度レベルをそのまま設定（0-4スケール）
          setSatisfaction(data.satisfaction_level);
        } else {
          throw new Error('データが見つかりません');
        }
      } catch (err) {
        setError('記録の取得に失敗しました');
        // デモ用のダミーデータ
        const dummyRecord = {
          id: parseInt(recordId),
          user: 1,
          date: '2024-01-15',
          memo: 'できたこと: プロジェクトの第1フェーズを完了した。\n\nできなかったこと: 時間管理が少し甘かった。',
          satisfaction_level: 4,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        };
        setRecord(dummyRecord);
        setDate(formatDateForInput(dummyRecord.date));
        
        // memoフィールドを解析してthingsDoneとthingsNotDoneに分割
        if (dummyRecord.memo) {
          // 新形式「できたこと」「できなかったこと」をまずチェック
          let parts = dummyRecord.memo.split('\n\nできなかったこと: ');
          if (parts.length === 2) {
            setThingsDone(parts[0].replace('できたこと: ', ''));
            setThingsNotDone(parts[1]);
          } else {
            // 旧形式「やったこと」「やらなかったこと」もサポート
            parts = dummyRecord.memo.split('\n\nやらなかったこと: ');
            if (parts.length === 2) {
              setThingsDone(parts[0].replace('やったこと: ', ''));
              setThingsNotDone(parts[1]);
            } else {
              setThingsDone(dummyRecord.memo);
              setThingsNotDone('');
            }
          }
        } else {
          setThingsDone('');
          setThingsNotDone('');
        }
        
        // 満足度レベルをそのまま設定（0-4スケール）
        setSatisfaction(dummyRecord.satisfaction_level);
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      setError('日付を選択してください');
      return;
    }

    if (!record) {
      setError('記録データが見つかりません');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const memo = `できたこと: ${thingsDone}\n\nできなかったこと: ${thingsNotDone}`;
      
      await api.updateRecord(record.id, {
        date,
        satisfaction_level: satisfaction,
        memo
      });
      
      router.push(`/records/${record.id}`);
    } catch (err) {
      setError('記録の更新に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="記録編集" showLogout={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="記録編集" showLogout={true} />
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">記録が見つかりませんでした</p>
              <Button onClick={() => router.back()} variant="outline">
                戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="記録編集" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-orange-200 bg-orange-50 mb-4 max-w-2xl mx-auto">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-2xl mx-auto border-orange-200 bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl text-orange-600">
              記録を編集
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 日付選択 */}
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  日付
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* できたこと */}
              <div className="space-y-2">
                <label htmlFor="thingsDone" className="text-sm font-medium text-gray-700">
                  できたこと
                </label>
                <Textarea
                  id="thingsDone"
                  value={thingsDone}
                  onChange={(e) => setThingsDone(e.target.value)}
                  placeholder="今日達成できたこと、良かったことを記録してください..."
                  rows={4}
                />
              </div>

              {/* できなかったこと */}
              <div className="space-y-2">
                <label htmlFor="thingsNotDone" className="text-sm font-medium text-gray-700">
                  できなかったこと
                </label>
                <Textarea
                  id="thingsNotDone"
                  value={thingsNotDone}
                  onChange={(e) => setThingsNotDone(e.target.value)}
                  placeholder="思うようにいかなかったこと、改善したいことを記録してください..."
                  rows={4}
                />
              </div>

              {/* 満足度選択 */}
              <SatisfactionSelector
                value={satisfaction}
                onChange={setSatisfaction}
              />

              {/* 送信ボタン */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? '更新中...' : '更新する'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 注意事項 */}
        <Card className="max-w-2xl mx-auto mt-6 border-gray-200 bg-gray-50/80">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              📝 編集について
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 過去の記録を振り返って、より詳細な情報を追加できます</li>
              <li>• 満足度は当時の気持ちを思い出しながら調整してください</li>
              <li>• 記録の日付を変更する場合は注意してください</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
