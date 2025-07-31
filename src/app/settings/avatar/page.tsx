'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PixelAvatarRenderer } from '@/components/avatar/PixelAvatarRenderer';
import { ArrowLeft, Palette, Save, RotateCcw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AvatarSettingsPage() {
  const router = useRouter();
  const { user, updateAvatar, isGuest, isLoading } = useAuthStore();

  // デフォルトアバター設定
  const [avatarStyle, setAvatarStyle] = useState({
    skinColor: 'light',
    hairStyle: 'short',
    hairColor: 'brown',
    clothing: 'blue',
    accessory: 'none',
    face: 'happy',
    background: 'transparent'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // ローディング中または認証チェック中はローディング画面を表示
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

  // カスタマイズオプション
  const skinColors = [
    { name: 'ライト', value: 'light', color: '#fdbcb4' },
    { name: 'ミディアム', value: 'medium', color: '#e8a87c' },
    { name: 'ダーク', value: 'dark', color: '#c67e5c' },
    { name: 'ペール', value: 'pale', color: '#f7d1c9' }
  ];

  const hairStyles = [
    { name: 'ショート', value: 'short' },
    { name: 'ロング', value: 'long' },
    { name: 'ポニーテール', value: 'ponytail' },
    { name: 'ボブ', value: 'bob' },
    { name: 'カーリー', value: 'curly' }
  ];

  const hairColors = [
    { name: 'ブラック', value: 'black', color: '#2c1b18' },
    { name: 'ブラウン', value: 'brown', color: '#6f4e37' },
    { name: 'ブロンド', value: 'blonde', color: '#faf0be' },
    { name: 'レッド', value: 'red', color: '#c54a2c' },
    { name: 'ブルー', value: 'blue', color: '#4a90e2' },
    { name: 'グリーン', value: 'green', color: '#5cb85c' },
    { name: 'パープル', value: 'purple', color: '#8e44ad' },
    { name: 'ホワイト', value: 'white', color: '#f8f9fa' },
    { name: 'ピンク', value: 'pink', color: '#ff69b4' }
  ];

  const clothingOptions = [
    { name: 'ブルー', value: 'blue', color: '#007bff' },
    { name: 'レッド', value: 'red', color: '#dc3545' },
    { name: 'グリーン', value: 'green', color: '#28a745' },
    { name: 'イエロー', value: 'yellow', color: '#ffc107' },
    { name: 'パープル', value: 'purple', color: '#6f42c1' },
    { name: 'オレンジ', value: 'orange', color: '#fd7e14' }
  ];

  const accessories = [
    { name: 'なし', value: 'none' },
    { name: 'メガネ', value: 'glasses' },
    { name: '帽子', value: 'hat' },
    { name: '王冠', value: 'crown' },
    { name: 'イヤホン', value: 'earphones' }
  ];

  const faces = [
    { name: 'ハッピー', value: 'happy' },
    { name: 'スマイル', value: 'smile' },
    { name: 'ウィンク', value: 'wink' },
    { name: 'クール', value: 'cool' },
    { name: 'サプライズ', value: 'surprise' }
  ];

  const handleStyleChange = (category: string, value: string) => {
    setAvatarStyle(prev => ({
      ...prev,
      [category]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const avatarConfig = {
        skinColor: avatarStyle.skinColor,
        hairStyle: avatarStyle.hairStyle,
        hairColor: avatarStyle.hairColor,
        clothing: avatarStyle.clothing,
        accessory: avatarStyle.accessory,
        face: avatarStyle.face,
        background: avatarStyle.background,
      };
      
      // AuthStoreのupdateAvatar関数を使用（ゲストユーザーにも対応） 
      await updateAvatar(avatarConfig);
      
      setHasChanges(false);
      alert('アバターを保存しました！');
    } catch (error) {
      console.error('アバター保存エラー:', error);
      alert('アバターの保存に失敗しました。');
    }
  };

  const handleReset = () => {
    setAvatarStyle({
      skinColor: 'light',
      hairStyle: 'short',
      hairColor: 'brown',
      clothing: 'blue',
      accessory: 'none',
      face: 'happy',
      background: 'transparent'
    });
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-purple-600" />
              <h1 className="text-lg font-bold text-gray-800">アバター設定</h1>
            </div>
          </div>

          {hasChanges && (
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          )}
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        {isGuest && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">ゲストモードでご利用中</p>
                  <p className="text-orange-700">
                    アバター設定は24時間保存されます。長期保存には
                    <Link href="/register" className="underline font-medium mx-1">アカウント登録</Link>
                    をおすすめします。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* アバタープレビュー */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
              <CardDescription>
                現在のアバターの見た目
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="p-8 bg-gray-50 rounded-lg">
                <PixelAvatarRenderer 
                  config={avatarStyle}
                  size={120}
                />
              </div>
              
              <div className="text-center">
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-gray-500">
                  {user.isGuest ? 'ゲストユーザー' : 'ユーザー'}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                リセット
              </Button>
            </CardContent>
          </Card>

          {/* カスタマイズオプション */}
          <div className="lg:col-span-2 space-y-6">
            {/* 肌の色 */}
            <Card>
              <CardHeader>
                <CardTitle>肌の色</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {skinColors.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('skinColor', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.skinColor === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: option.color }}
                      />
                      <p className="text-xs text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 髪型 */}
            <Card>
              <CardHeader>
                <CardTitle>髪型</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {hairStyles.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('hairStyle', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.hairStyle === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 髪の色 */}
            <Card>
              <CardHeader>
                <CardTitle>髪の色</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {hairColors.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('hairColor', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.hairColor === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: option.color }}
                      />
                      <p className="text-xs text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 服装 */}
            <Card>
              <CardHeader>
                <CardTitle>服装</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {clothingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('clothing', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.clothing === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded mx-auto mb-2"
                        style={{ backgroundColor: option.color }}
                      />
                      <p className="text-xs text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* アクセサリー */}
            <Card>
              <CardHeader>
                <CardTitle>アクセサリー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {accessories.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('accessory', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.accessory === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 表情 */}
            <Card>
              <CardHeader>
                <CardTitle>表情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {faces.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStyleChange('face', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarStyle.face === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-center">{option.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 保存ボタン（モバイル用） */}
        {hasChanges && (
          <div className="fixed bottom-4 left-4 right-4 lg:hidden">
            <Button onClick={handleSave} className="w-full flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
