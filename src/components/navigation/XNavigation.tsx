'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Users, 
  Mail, 
  Bookmark,
  User,
  Settings,
  MapPin,
  Trophy,
  BookOpen
} from 'lucide-react';

const navItems = [
  { 
    href: '/dashboard', 
    icon: Home, 
    label: 'ホーム',
    activeColor: 'text-blue-500 bg-blue-50'
  },
  { 
    href: '/map', 
    icon: MapPin, 
    label: '地図',
    activeColor: 'text-green-500 bg-green-50'
  },
  { 
    href: '/quest', 
    icon: Trophy, 
    label: 'クエスト',
    activeColor: 'text-purple-500 bg-purple-50'
  },
  { 
    href: '/diary', 
    icon: BookOpen, 
    label: '日記',
    activeColor: 'text-pink-500 bg-pink-50'
  }
];

export const XNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around py-1">
          {navItems.map(({ href, icon: Icon, label, activeColor }) => {
            const isActive = pathname === href || 
                           (href === '/quest' && pathname.startsWith('/quests')) ||
                           (href === '/diary' && pathname.startsWith('/diary')) ||
                           (href === '/profile' && pathname.startsWith('/settings'));
            
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95 relative group min-w-[60px]
                  ${isActive 
                    ? `${activeColor} font-semibold shadow-sm` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {/* アイコン部分 */}
                <div className="relative">
                  <Icon 
                    className={`h-6 w-6 mb-1 transition-all duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* アクティブ時のドット */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full" />
                  )}
                </div>
                
                {/* ラベル */}
                <span className={`
                  text-xs leading-tight transition-all duration-200
                  ${isActive ? 'font-semibold' : 'font-medium'}
                `}>
                  {label}
                </span>
                
                {/* ホバーエフェクト */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* iPhone X風のホームインジケーター */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
