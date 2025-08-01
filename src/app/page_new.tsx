'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { SatisfactionDisplay } from '@/components/features/satisfaction-display';
import { api } from '@/lib/api';
import { getSatisfactionImagePath } from '@/lib/utils';
import { HomeData, SATISFACTION_LEVELS } from '@/types';

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await api.getHomeData();
        setHomeData(response.data || null);
      } catch (err) {
        setError('ホーム画面データの取得に失敗しました');
        // デモ用のダミーデータ
        setHomeData({
          averageSatisfaction: 3.5,
          yesterdaySatisfaction: 4,
          consecutiveDays: 7
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <PageHeader title="満足度記録アプリ" showLogout={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  const averageSatisfaction = homeData?.averageSatisfaction ?? 3;
  const imagePath = getSatisfactionImagePath(averageSatisfaction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <PageHeader title="満足度記録アプリ" showLogout={true} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                {error} (デモデータを表示中)
              </p>
            </CardContent>
          </Card>
        )}

        {/* メイン画像と満足度表示 */}
        <div className="relative">
          <div className="satisfaction-image aspect-video w-full max-w-md mx-auto">
            <Image
              src={imagePath}
              alt={`満足度レベル ${Math.round(averageSatisfaction)}`}
              fill
              className="object-cover"
              priority
              onError={() => {
                // 画像が見つからない場合のフォールバック
                console.warn(`Image not found: ${imagePath}`);
              }}
            />
            <div className="satisfaction-badge">
              {averageSatisfaction.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 満足度レベルの説明 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto">
          {SATISFACTION_LEVELS.map((level) => (
            <div
              key={level.value}
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 shadow-sm"
            >
              <span className="text-lg">{level.emoji}</span>
              <div className="text-xs">
                <div className="font-medium">{level.value}</div>
                <div className="text-gray-600">{level.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Card className="border-orange-200 bg-white/90">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {homeData?.yesterdaySatisfaction ?? '未記録'}
              </div>
              <div className="text-sm text-gray-600">昨日の満足度</div>
              {homeData?.yesterdaySatisfaction !== null && (
                <SatisfactionDisplay 
                  level={homeData?.yesterdaySatisfaction ?? 0}
                  showLabel={false}
                  size="sm"
                  className="justify-center mt-2"
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/90">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {homeData?.consecutiveDays ?? 0}
              </div>
              <div className="text-sm text-gray-600">連続記録日数</div>
              <div className="text-xs text-gray-500 mt-1">
                {homeData?.consecutiveDays ? '継続中！' : '記録を始めよう'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 平均満足度の詳細 */}
        <Card className="border-orange-200 bg-white/90 max-w-md mx-auto">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              あなたの平均満足度
            </div>
            <SatisfactionDisplay 
              level={Math.round(averageSatisfaction)}
              showLabel={true}
              size="lg"
              className="justify-center"
            />
            <div className="text-sm text-gray-600 mt-2">
              数値: {averageSatisfaction.toFixed(1)} / 5.0
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
