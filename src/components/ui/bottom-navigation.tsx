'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Map, 
  Calendar, 
  MessageCircle, 
  User,
  Target,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'ホーム',
    href: '/dashboard',
    icon: Home,
    activeColor: 'text-blue-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: 'マップ',
    href: '/map',
    icon: Map,
    activeColor: 'text-green-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: 'クエスト',
    href: '/quest',
    icon: Target,
    activeColor: 'text-purple-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: 'カレンダー',
    href: '/calendar',
    icon: Calendar,
    activeColor: 'text-orange-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: '日記',
    href: '/diary',
    icon: BookOpen,
    activeColor: 'text-pink-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: 'チャット',
    href: '/chat',
    icon: MessageCircle,
    activeColor: 'text-red-600',
    inactiveColor: 'text-gray-500'
  },
  {
    name: 'プロフィール',
    href: '/profile',
    icon: User,
    activeColor: 'text-indigo-600',
    inactiveColor: 'text-gray-500'
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-50 safe-area-pb shadow-lg">
      <div className="grid grid-cols-7 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-300 transform relative",
                isActive ? "scale-105" : "hover:scale-105 active:scale-95"
              )}
            >
              {/* アクティブインジケーター（上部） */}
              {isActive && (
                <div 
                  className={cn(
                    "absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300",
                    item.activeColor.replace('text-', 'bg-')
                  )}
                />
              )}
              
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive 
                  ? cn("shadow-lg", item.activeColor.replace('text-', 'bg-').replace('600', '50')) 
                  : "hover:bg-gray-50"
              )}>
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? cn(item.activeColor, "drop-shadow-sm") : item.inactiveColor
                  )} 
                />
              </div>
              
              <span 
                className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? cn(item.activeColor, "font-semibold") : item.inactiveColor
                )}
              >
                {item.name}
              </span>
              
              {/* アクティブ時の輝きエフェクト */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
