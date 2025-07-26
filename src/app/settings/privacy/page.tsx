'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user, setUser, isGuest } = useAuthStore();
  const [settings, setSettings] = useState({
    showLocation: true,
    locationPrecision: 'area' as 'exact' | 'area' | 'disabled',
    profileVisibility: 'public' as 'public' | 'limited' | 'private',
    logVisibility: 'public' as 'public' | 'limited' | 'private',
    locationSharing: true,
    locationGranularity: 'rough' as 'exact' | 'rough' | 'off',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.settings?.privacy) {
      setSettings(user.settings.privacy);
    }
  }, [user, router]);

  const handleSettingChange = (key: string, value: any) => {
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
            privacy: settings
          }
        };
        
        localStorage.setItem('hakumine_guest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        alert('プライバシー設定を更新しました！');
      } else {
        // 通常ユーザーの場合はFirebaseを更新
        // TODO: Firebaseでのプライバシー設定更新処理を実装
        console.log('Firebaseプライバシー設定更新:', settings);
        alert('プライバシー設定を更新しました！');
      }
    } catch (error) {
      console.error('プライバシー設定更新エラー:', error);
      alert('プライバシー設定の更新に失敗しました。');
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
            <Shield className="h-6 w-6 text-green-600" />
            <h1 className="text-lg font-bold text-gray-800">プライバシー設定</h1>
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
                    設定は24時間保存されます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* 位置情報設定 */}
          <Card>
            <CardHeader>
              <CardTitle>位置情報設定</CardTitle>
              <CardDescription>
                マップでの位置情報の公開方法を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-location">位置情報を表示</Label>
                  <p className="text-sm text-gray-500">
                    マップで他の参加者に位置を表示する
                  </p>
                </div>
                <input
                  id="show-location"
                  type="checkbox"
                  checked={settings.showLocation}
                  onChange={(e) => handleSettingChange('showLocation', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-precision">位置情報の精度</Label>
                <select
                  id="location-precision"
                  value={settings.locationPrecision}
                  onChange={(e) => handleSettingChange('locationPrecision', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exact">正確な位置</option>
                  <option value="area">エリア単位</option>
                  <option value="disabled">位置情報なし</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* プロフィール公開設定 */}
          <Card>
            <CardHeader>
              <CardTitle>プロフィール公開設定</CardTitle>
              <CardDescription>
                プロフィール情報の公開範囲を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">プロフィールの公開範囲</Label>
                <select
                  id="profile-visibility"
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">全体に公開</option>
                  <option value="limited">参加者のみ</option>
                  <option value="private">非公開</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="log-visibility">日記の公開範囲</Label>
                <select
                  id="log-visibility"
                  value={settings.logVisibility}
                  onChange={(e) => handleSettingChange('logVisibility', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">全体に公開</option>
                  <option value="limited">参加者のみ</option>
                  <option value="private">非公開</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
}
