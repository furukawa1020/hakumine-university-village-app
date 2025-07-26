'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Save, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LocationSettingsPage() {
  const router = useRouter();
  const { user, setUser, isGuest } = useAuthStore();
  const [settings, setSettings] = useState({
    locationSharing: true,
    locationGranularity: 'rough' as 'exact' | 'rough' | 'off',
    showLocation: true,
    locationPrecision: 'area' as 'exact' | 'area' | 'disabled',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.settings?.privacy) {
      setSettings({
        locationSharing: user.settings.privacy.locationSharing,
        locationGranularity: user.settings.privacy.locationGranularity,
        showLocation: user.settings.privacy.showLocation,
        locationPrecision: user.settings.privacy.locationPrecision,
      });
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
            privacy: {
              ...user.settings.privacy,
              ...settings
            }
          }
        };
        
        localStorage.setItem('hakumine_guest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        alert('位置情報設定を更新しました！');
      } else {
        // 通常ユーザーの場合はFirebaseを更新
        // TODO: Firebaseでの位置情報設定更新処理を実装
        console.log('Firebase位置情報設定更新:', settings);
        alert('位置情報設定を更新しました！');
      }
    } catch (error) {
      console.error('位置情報設定更新エラー:', error);
      alert('位置情報設定の更新に失敗しました。');
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
            <MapPin className="h-6 w-6 text-red-600" />
            <h1 className="text-lg font-bold text-gray-800">位置情報設定</h1>
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
          {/* 基本設定 */}
          <Card>
            <CardHeader>
              <CardTitle>基本設定</CardTitle>
              <CardDescription>
                マップでの位置情報表示の基本設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="location-sharing">位置情報共有</Label>
                  <p className="text-sm text-gray-500">
                    他の参加者と位置情報を共有する
                  </p>
                </div>
                <input
                  id="location-sharing"
                  type="checkbox"
                  checked={settings.locationSharing}
                  onChange={(e) => handleSettingChange('locationSharing', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-location">マップに表示</Label>
                  <p className="text-sm text-gray-500">
                    マップ上でアバターを表示する
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
            </CardContent>
          </Card>

          {/* 詳細設定 */}
          <Card>
            <CardHeader>
              <CardTitle>詳細設定</CardTitle>
              <CardDescription>
                位置情報の精度や公開範囲を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location-granularity">位置情報の粒度</Label>
                <select
                  id="location-granularity"
                  value={settings.locationGranularity}
                  onChange={(e) => handleSettingChange('locationGranularity', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exact">正確な位置</option>
                  <option value="rough">おおまかな位置</option>
                  <option value="off">位置情報OFF</option>
                </select>
                <p className="text-sm text-gray-500">
                  「おおまかな位置」推奨：プライバシーを保護しながら交流できます
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-precision">表示精度</Label>
                <select
                  id="location-precision"
                  value={settings.locationPrecision}
                  onChange={(e) => handleSettingChange('locationPrecision', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exact">ピンポイント</option>
                  <option value="area">エリア単位</option>
                  <option value="disabled">非表示</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-2">プライバシーについて</p>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• 位置情報は白峰エリア内でのみ共有されます</li>
                    <li>• いつでも設定を変更できます</li>
                    <li>• 正確な住所は他の参加者には表示されません</li>
                    <li>• 位置情報をOFFにしても、アプリの他の機能は利用できます</li>
                  </ul>
                </div>
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
