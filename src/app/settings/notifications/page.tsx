'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const { user, setUser, isGuest } = useAuthStore();
  const [settings, setSettings] = useState({
    questNotifications: true,
    chatNotifications: true,
    systemNotifications: true,
    emailNotifications: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.settings?.notifications) {
      setSettings(user.settings.notifications);
    }
  }, [user, router]);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (isGuest) {
        // ゲストユーザーの場合、localStorageを更新
        const updatedUser = {
          ...user,
          settings: {
            ...user.settings,
            notifications: settings
          }
        };
        
        localStorage.setItem('hakumine_guest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        alert('通知設定を更新しました！');
      } else {
        // 通常ユーザーの場合はFirebaseを更新
        // TODO: Firebaseでの通知設定更新処理を実装
        console.log('Firebase通知設定更新:', settings);
        alert('通知設定を更新しました！');
      }
    } catch (error) {
      console.error('通知設定更新エラー:', error);
      alert('通知設定の更新に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
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
            <Bell className="h-6 w-6 text-yellow-600" />
            <h1 className="text-lg font-bold text-gray-800">通知設定</h1>
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
                    設定は24時間保存されます。メール通知は利用できません。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
            <CardDescription>
              受信したい通知の種類を設定できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="quest-notifications">クエスト通知</Label>
                  <p className="text-sm text-gray-500">
                    新しいクエストの投稿や参加状況の更新を通知
                  </p>
                </div>
                <input
                  id="quest-notifications"
                  type="checkbox"
                  checked={settings.questNotifications}
                  onChange={(e) => handleSettingChange('questNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="chat-notifications">チャット通知</Label>
                  <p className="text-sm text-gray-500">
                    新しいメッセージやメンションを通知
                  </p>
                </div>
                <input
                  id="chat-notifications"
                  type="checkbox"
                  checked={settings.chatNotifications}
                  onChange={(e) => handleSettingChange('chatNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="system-notifications">システム通知</Label>
                  <p className="text-sm text-gray-500">
                    アプリの更新情報やお知らせを通知
                  </p>
                </div>
                <input
                  id="system-notifications"
                  type="checkbox"
                  checked={settings.systemNotifications}
                  onChange={(e) => handleSettingChange('systemNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">メール通知</Label>
                  <p className="text-sm text-gray-500">
                    重要な更新をメールで受信（ゲストモードでは利用不可）
                  </p>
                </div>
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  disabled={isGuest}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
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
