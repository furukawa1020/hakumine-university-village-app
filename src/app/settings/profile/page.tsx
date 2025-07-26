'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, setUser, isGuest, isLoading } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // ローディング中は何もしない
    if (isLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    setDisplayName(user.displayName || '');
    if ('email' in user) {
      setEmail(user.email || '');
    }
  }, [user, router, isLoading]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (isGuest) {
        // ゲストユーザーの場合、localStorageを更新
        const updatedUser = {
          ...user,
          displayName: displayName.trim()
        };
        
        localStorage.setItem('hakumine_guest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        alert('プロフィールを更新しました！');
      } else {
        // 通常ユーザーの場合はFirebaseを更新
        // TODO: Firebaseでのプロフィール更新処理を実装
        console.log('Firebaseでプロフィール更新:', { displayName, email });
        alert('プロフィールを更新しました！');
      }
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      alert('プロフィールの更新に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">プロフィール設定</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        {isGuest && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">ゲストモードでご利用中</p>
                  <p className="text-orange-700">
                    設定は24時間保存されます。長期保存には
                    <Link href="/register" className="underline font-medium">アカウント登録</Link>
                    をおすすめします。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>
              あなたの基本的なプロフィール情報を設定できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">表示名 *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力してください"
                maxLength={50}
              />
              <p className="text-sm text-gray-500">
                チャットやクエストで他の参加者に表示される名前です
              </p>
            </div>

            {!isGuest && (
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレス"
                  disabled={true}
                />
                <p className="text-sm text-gray-500">
                  メールアドレスの変更はサポートにお問い合わせください
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !displayName.trim()}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? '保存中...' : '保存'}
              </Button>
              <Link href="/settings">
                <Button variant="outline">キャンセル</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
