'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface PageHeaderProps {
  title: string;
  showLogout?: boolean;
}

export function PageHeader({ title, showLogout = false }: PageHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // ログアウトAPIが失敗しても、クライアント側ではログアウト状態にする
      console.error('Logout error:', error);
    }
    router.push('/auth/login');
  };

  return (
    <header className="bg-orange-500 text-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold">{title}</h1>
        {showLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-orange-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        )}
      </div>
    </header>
  );
}
