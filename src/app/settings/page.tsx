'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  MapPin, 
  Palette,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, mounted, router]);

  if (!mounted || !user) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">読み込み中...</div>
    </div>;
  }

  const settingsSections = [
    {
      title: 'プロフィール設定',
      description: 'アバターや表示名を変更',
      icon: User,
      href: '/settings/profile',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'アバター設定',
      description: 'アバターのカスタマイズ',
      icon: Palette,
      href: '/settings/avatar',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '通知設定',
      description: 'クエストやチャットの通知',
      icon: Bell,
      href: '/settings/notifications',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'プライバシー設定',
      description: '位置情報や公開範囲の設定',
      icon: Shield,
      href: '/settings/privacy',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '位置情報設定',
      description: '地図での表示設定',
      icon: MapPin,
      href: '/settings/location',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">設定</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        {/* ユーザー情報カード */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{user.displayName}</h2>
                <p className="text-gray-600">{user.isGuest ? 'ゲストユーザー' : user.email}</p>
                {user.isGuest && (
                  <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    ゲストモード（24時間限定）
                  </span>
                )}
              </div>
            </div>
            
            {user.isGuest && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>アカウント登録でデータ永続保存：</strong>
                  現在すべての機能をご利用いただけます。アカウント登録でデータを永続保存しましょう。
                </p>
                <Link href="/register" className="inline-block mt-2">
                  <Button size="sm" className="text-xs">
                    アカウント登録
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 設定項目一覧 */}
        <div className="space-y-3">
          {settingsSections.map((section, index) => (
            <Link key={index} href={section.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                      <section.icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* アカウント管理 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">アカウント管理</CardTitle>
            <CardDescription>
              アカウントに関する操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              {user.isGuest ? 'ゲストセッション終了' : 'ログアウト'}
            </Button>
            
            {!user.isGuest && (
              <Button
                variant="outline"
                className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50"
                disabled
              >
                アカウント削除（未実装）
              </Button>
            )}
          </CardContent>
        </Card>

        {/* アプリ情報 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>白峰大学村アプリ v1.0.0</p>
          <p className="mt-1">
            <Link href="/avatar-guide" className="text-blue-600 hover:underline">
              アバター機能について
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
