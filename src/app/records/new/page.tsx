'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SatisfactionSelector } from '@/components/features/satisfaction-selector';
import { api } from '@/lib/api';
import { formatDateForInput } from '@/lib/utils';

export default function NewRecordPage() {
  const [date, setDate] = useState('');
  const [thingsDone, setThingsDone] = useState('');
  const [thingsNotDone, setThingsNotDone] = useState('');
  const [satisfaction, setSatisfaction] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingRecordWarning, setExistingRecordWarning] = useState<string | null>(null);
  const [existingRecordId, setExistingRecordId] = useState<number | null>(null);
  const router = useRouter();

  // 日付変更時に既存レコードをチェック
  const handleDateChange = async (selectedDate: string) => {
    setDate(selectedDate);
    setExistingRecordWarning(null);
    setExistingRecordId(null);
    
    if (selectedDate) {
      try {
        // 既存レコードをチェック（簡単な実装のため、レコード一覧を取得して確認）
        const response = await api.getRecords();
        const existingRecord = response.data?.find((record: any) => record.date === selectedDate);
        
        if (existingRecord) {
          setExistingRecordWarning('この日付の記録は既に存在します。');
          setExistingRecordId(existingRecord.id);
        }
      } catch (err) {
        // エラーが発生してもチェックを続行
        console.warn('Failed to check existing records:', err);
      }
    }
  };

  // 既存レコードの編集ページに移動
  const handleEditExisting = () => {
    if (existingRecordId) {
      router.push(`/records/${existingRecordId}/edit`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      setError('日付を選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const memo = `できたこと: ${thingsDone}\n\nできなかったこと: ${thingsNotDone}`;
      
      const response = await api.createRecord({
        date,
        satisfaction_level: satisfaction,
        memo
      });
      
      // 成功時はリストページに戻る
      router.push('/records');
    } catch (err) {
      console.error('Record creation error:', err);
      if (err instanceof Error) {
        if (err.message.includes('IntegrityError')) {
          setError('この日付の記録は既に存在します。既存の記録が更新されました。');
          // 少し待ってからリストページに移動
          setTimeout(() => router.push('/records'), 2000);
        } else if (err.message.includes('API error')) {
          setError('サーバーエラーが発生しました。しばらく待ってから再試行してください。');
        } else {
          setError('記録の保存に失敗しました。もう一度お試しください。');
        }
      } else {
        setError('予期しないエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="新しい記録" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto border-orange-200 bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl text-orange-600">
              今日の満足度を記録しましょう
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {existingRecordWarning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm mb-2">{existingRecordWarning}</p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditExisting}
                      className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                    >
                      既存の記録を編集
                    </Button>
                    <span className="text-yellow-700 text-xs self-center">
                      または、このまま保存すると既存の記録が更新されます
                    </span>
                  </div>
                </div>
              )}

              {/* 日付選択 */}
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  日付
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
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
                <p className="text-xs text-gray-500">
                  どんな小さなことでも構いません。自分を褒めてあげましょう！
                </p>
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
                <p className="text-xs text-gray-500">
                  次回に活かすためのメモとして活用しましょう
                </p>
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
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '保存中...' : '記録を保存'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ヒント */}
        <Card className="max-w-2xl mx-auto mt-6 border-orange-200 bg-orange-50/80">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">
              💡 記録のコツ
            </h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 毎日同じ時間に記録する習慣をつけましょう</li>
              <li>• 小さな成功も見逃さずに「できたこと」に記録しましょう</li>
              <li>• 「できなかったこと」は自分を責めるのではなく、改善のヒントとして活用しましょう</li>
              <li>• 満足度は正直な気持ちで選択しましょう</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
