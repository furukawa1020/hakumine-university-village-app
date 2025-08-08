'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mountain, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  Trophy,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { XNavigation } from '@/components/navigation/XNavigation';

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR中は何もレンダリングしない
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ダッシュボードを読み込み中...</p>
        </div>
      </div>
    );
  }

  return <DashboardPageContent />;
}

function DashboardPageContent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // ユーザーがログインしていない場合はログインページへ
    if (!user) {
      router.push('/login');
      return;
    }

    // 現在時刻の更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // アバタープレビュー
  const AvatarPreview = ({ size = 'w-8 h-8' }: { size?: string }) => (
    <div className={`${size} bg-blue-100 rounded-full flex items-center justify-center`}>
      <Users className="h-4 w-4 text-blue-600" />
    </div>
  );

  const menuItems = [
    { icon: MapPin, label: 'マップ', href: '/map', color: 'text-red-600' },
    { icon: Trophy, label: 'クエスト', href: '/quest', color: 'text-green-600' },
    { icon: Calendar, label: 'カレンダー', href: '/calendar', color: 'text-purple-600' },
    { icon: MessageCircle, label: 'チャット', href: '/chat', color: 'text-yellow-600' },
    { icon: BookOpen, label: '日記', href: '/diary', color: 'text-indigo-600' },
    { icon: User, label: 'プロフィール', href: '/profile', color: 'text-blue-600' },
    { icon: Settings, label: 'アバター設定', href: '/settings/avatar', color: 'text-pink-600' },
    { icon: Settings, label: '設定', href: '/settings', color: 'text-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">白峰大学村</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <AvatarPreview />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800">{user.displayName}</p>
                  {user.isGuest && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      ゲスト
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{user.status}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200
          transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 pt-20 lg:pt-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              
              <hr className="my-4" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <Mountain className="h-5 w-5" />
                <span className="font-medium">ログアウト</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* オーバーレイ（モバイル用） */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 lg:p-6">
          {/* ゲストモード情報バナー */}
          {user.isGuest && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">🌟</div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800 mb-1">ゲストモードで全機能体験中</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    24時間の間、すべての機能をお試しいただけます。
                    気に入ったらアカウント登録でデータを永続保存しましょう！
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center text-sm font-medium text-blue-800 hover:text-blue-900 underline"
                  >
                    アカウント登録でデータ保存 →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ゲストユーザー向けウェルカムメッセージ */}
          {user.isGuest && (
            <div className="mb-6">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-900 mb-2">
                        🎉 白峰大学村アプリへようこそ！
                      </h3>
                      <p className="text-blue-800 mb-3">
                        ゲストモードですべての機能をフルに体験できます！
                        クエスト参加、チャット、カレンダー、マップなど、すべてお試しください。
                      </p>
                      
                      <div className="bg-white/50 rounded-lg p-3 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">✨ 利用できる全機能</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• クエストの閲覧・参加・作成</li>
                          <li>• チャットでのコミュニケーション</li>
                          <li>• カレンダーでのスケジュール管理</li>
                          <li>• マップでの位置情報共有</li>
                          <li>• 日記ログの作成・公開</li>
                          <li>• アバターのカスタマイズ</li>
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href="/register">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            アカウント登録でデータ永続保存
                          </Button>
                        </Link>
                        <Link href="/avatar-guide">
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            アプリ機能ガイド
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ウェルカムセクション */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">
                  {user.isGuest ? `ようこそ、${user.displayName}さん！` : `おかえりなさい、${user.displayName}さん！`}
                </h2>
                <p className="opacity-90">
                  今日は{currentTime.toLocaleDateString('ja-JP', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}です
                </p>
                <p className="text-sm opacity-75 mt-1">
                  {user.isGuest ? 'ゲストモードで全機能をお試しください' : '白峰での素敵な一日をお過ごしください'}
                </p>
              </div>
              <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 opacity-20">
                <Mountain className="h-32 w-32" />
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">今日のクエスト</CardTitle>
                    <CardDescription>参加可能: 3件</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">雪かき、薪割り、お手伝いクエストが利用可能です</p>
                <Link href="/quests">
                  <Button size="sm" className="w-full">
                    クエストを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">近くの仲間</CardTitle>
                    <CardDescription>オンライン: 8人</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">白峰エリアで活動中の学生を確認できます</p>
                <Link href="/map">
                  <Button size="sm" className="w-full" variant="outline">
                    マップを開く
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">新着メッセージ</CardTitle>
                    <CardDescription>未読: 5件</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">全体チャットやクエストスレッドに新着があります</p>
                <Link href="/chat">
                  <Button size="sm" className="w-full" variant="outline">
                    チャットを開く
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 最近の活動 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  今日の予定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">雪かきクエスト</p>
                      <p className="text-xs text-gray-500">10:00 - 12:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">薪割り体験</p>
                      <p className="text-xs text-gray-500">14:00 - 16:00</p>
                    </div>
                  </div>
                  <Link href="/calendar">
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      カレンダーを開く
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  最近の日記
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium text-sm mb-1">雪かき体験記</p>
                    <p className="text-xs text-gray-600 mb-2">初めての雪かきは大変だったけど、みんなでやると楽しい！地域の方にも感謝された...</p>
                    <p className="text-xs text-gray-400">2日前</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium text-sm mb-1">白峰の夜空</p>
                    <p className="text-xs text-gray-600 mb-2">都市部では見られない満天の星空。写真では伝わらない美しさでした...</p>
                    <p className="text-xs text-gray-400">5日前</p>
                  </div>
                  <Link href="/diary">
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      日記を書く
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* X風ナビゲーション */}
        <XNavigation />
      </div>
    </div>
  );
}
