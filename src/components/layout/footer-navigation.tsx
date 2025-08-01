'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, PenTool, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'ホーム',
    href: '/',
    icon: Home,
  },
  {
    name: '記録一覧',
    href: '/records',
    icon: List,
  },
  {
    name: '記録',
    href: '/records/new',
    icon: PenTool,
  },
  {
    name: 'ランキング',
    href: '/ranking',
    icon: Trophy,
  },
];

export function FooterNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 shadow-lg">
      <div className="flex justify-around items-center h-16 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
