'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.register({ 
        username, 
        email, 
        password, 
        password_confirm: confirmPassword 
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError('ユーザー登録に失敗しました。ユーザー名またはメールアドレスが既に使用されている可能性があります。');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              登録完了！
            </h2>
            <p className="text-gray-600">
              ユーザー登録が完了しました。<br />
              ログインページに自動的に移動します...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">
            ユーザー登録
          </CardTitle>
          <p className="text-gray-600 text-sm">
            満足度記録アプリのアカウントを作成
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
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                ユーザー名
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                required
              />
              <p className="text-xs text-gray-500">
                他のユーザーに表示される名前です
              </p>
            </div>

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
                placeholder="パスワードを入力（6文字以上）"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                パスワード確認
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再入力"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? '登録中...' : 'アカウント作成'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は{' '}
              <Link 
                href="/auth/login" 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                こちらからログイン
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
