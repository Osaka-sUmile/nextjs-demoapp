'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { RankingItem } from '@/types';
import { Trophy, Medal, Award } from 'lucide-react';

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        console.log('ランキングAPIを呼び出し中...');
        const response = await api.getRanking();
        console.log('APIレスポンス:', response);
        
        // バックエンドから直接配列が返される場合とdata構造で返される場合を両方対応
        const rankingData = Array.isArray(response) ? response : (response.data || []);
        console.log('ランキングデータ:', rankingData);
        
        setRankings(rankingData);
        setError(null); // 成功時はエラーをクリア
      } catch (err) {
        console.error('ランキング取得エラー:', err);
        setError('ランキングデータの取得に失敗しました');
        // デモ用のダミーデータ
        setRankings([
          {
            id: 1,
            rank: 1,
            username: 'SatisfactionMaster',
            email: 'demo1@example.com',
            totalSatisfaction: 245,
            averageSatisfaction: 4.2,
            totalRecords: 58
          },
          {
            id: 2,
            rank: 2,
            username: 'HappyUser123',
            email: 'demo2@example.com',
            totalSatisfaction: 198,
            averageSatisfaction: 3.8,
            totalRecords: 52
          },
          {
            id: 3,
            rank: 3,
            username: 'PositiveVibes',
            email: 'demo3@example.com',
            totalSatisfaction: 176,
            averageSatisfaction: 3.5,
            totalRecords: 50
          },
          {
            id: 4,
            rank: 4,
            username: 'GrowthSeeker',
            email: 'demo4@example.com',
            totalSatisfaction: 152,
            averageSatisfaction: 3.2,
            totalRecords: 47
          },
          {
            id: 5,
            rank: 5,
            username: 'DailyTracker',
            email: 'demo5@example.com',
            totalSatisfaction: 134,
            averageSatisfaction: 3.0,
            totalRecords: 45
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return (
          <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
            {rank}
          </div>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="ランキング" showLogout={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="ランキング" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                {error} (デモデータを表示中)
              </p>
            </CardContent>
          </Card>
        )}

        {/* ランキングタイトル */}
        <Card className="border-orange-200 bg-white/95 mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-600 flex items-center justify-center">
              <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
              全ユーザーランキング
            </CardTitle>
            <p className="text-gray-600">
              総満足度ポイントによるランキング（上位5位）
            </p>
          </CardHeader>
        </Card>

        {/* ランキングリスト */}
        {rankings.length === 0 ? (
          <Card className="border-orange-200 bg-white/90">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-4">
                ランキングデータがありません
              </div>
              <p className="text-gray-600">
                まだユーザーの記録が十分にありません
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rankings.map((item) => (
              <Card
                key={item.rank}
                className={`border transition-transform hover:scale-[1.02] ${getRankColor(item.rank)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 順位アイコン */}
                      <div className="flex-shrink-0">
                        {getRankIcon(item.rank)}
                      </div>
                      
                      {/* ユーザー名 */}
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {item.username}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.rank === 1 && '🏆 チャンピオン'}
                          {item.rank === 2 && '🥈 準優勝'}
                          {item.rank === 3 && '🥉 第3位'}
                          {item.rank > 3 && `第${item.rank}位`}
                        </p>
                      </div>
                    </div>
                    
                    {/* ポイント表示 */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-sm text-gray-600">総ポイント</span>
                        <div className="bg-orange-500 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold">
                          {item.totalSatisfaction}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ランキング説明 */}
        <Card className="border-orange-200 bg-orange-50/80 mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-3">
              📊 ランキングについて
            </h3>
            <div className="text-sm text-orange-700 space-y-2">
              <p>
                <strong>総満足度ポイント</strong>：
                これまでに記録した満足度レベル（0-5）の合計値です
              </p>
              <p>
                <strong>計算方法</strong>：
                満足度5の記録なら5ポイント、満足度3の記録なら3ポイントが加算されます
              </p>
              <p>
                <strong>更新頻度</strong>：
                ランキングは新しい記録が追加されるたびに更新されます
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 自分のランク表示エリア（将来の拡張用） */}
        <Card className="border-orange-200 bg-white/90 mt-6">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">
              あなたの順位
            </p>
            <p className="text-gray-500 text-xs">
              ログイン機能実装後に表示予定
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
