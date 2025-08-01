'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.login({ email, password });
      console.log('Login response:', response);
      // セッション認証の場合、トークンの保存は不要
      // ログイン成功時はホームページにリダイレクト
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      // エラーの詳細を表示
      if (err instanceof Error) {
        setError(`ログインに失敗しました: ${err.message}`);
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">
            ログイン
          </CardTitle>
          <p className="text-gray-600 text-sm">
            満足度記録アプリへようこそ
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は{' '}
              <Link 
                href="/auth/register" 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                こちらから登録
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
