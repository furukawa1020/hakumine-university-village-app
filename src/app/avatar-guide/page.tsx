'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PixelAvatar } from '@/components/avatar/PixelAvatar';
import { ArrowLeft, Palette, Users, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AvatarGuidePage() {
  const [currentExample, setCurrentExample] = useState(0);

  // サンプルアバター設定
  const exampleAvatars = [
    {
      style: {
        skinColor: 'light',
        hairStyle: 'short',
        hairColor: 'brown',
        clothing: 'blue',
        accessory: 'none',
        face: 'happy',
        background: 'transparent'
      },
      name: '学生A',
      description: 'デフォルトスタイル'
    },
    {
      style: {
        skinColor: 'medium',
        hairStyle: 'long',
        hairColor: 'black',
        clothing: 'red',
        accessory: 'glasses',
        face: 'smile',
        background: 'transparent'
      },
      name: '学生B',
      description: 'メガネをかけたスタイル'
    },
    {
      style: {
        skinColor: 'pale',
        hairStyle: 'ponytail',
        hairColor: 'blonde',
        clothing: 'green',
        accessory: 'hat',
        face: 'wink',
        background: 'transparent'
      },
      name: '学生C',
      description: '帽子をかぶったスタイル'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">アバター機能について</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        {/* メインタイトル */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🎨 アバター機能の使い方
          </h2>
          <p className="text-gray-600">
            あなただけのオリジナルアバターを作成して、白峰大学村での活動を楽しもう！
          </p>
        </div>

        {/* アバターサンプル表示 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              アバターサンプル
            </CardTitle>
            <CardDescription>
              さまざまなスタイルのアバターを見てみましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {exampleAvatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    currentExample === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentExample(index)}
                >
                  <div className="flex flex-col items-center">
                    <PixelAvatar 
                      style={avatar.style}
                      size={64}
                      showName={avatar.name}
                    />
                    <p className="text-sm font-medium mt-2">{avatar.name}</p>
                    <p className="text-xs text-gray-500">{avatar.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">選択中:</span>
                <PixelAvatar 
                  style={exampleAvatars[currentExample].style}
                  size={32}
                />
                <span className="text-sm font-medium">
                  {exampleAvatars[currentExample].name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 機能説明 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-500" />
                カスタマイズ機能
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">肌の色</p>
                  <p className="text-sm text-gray-600">4種類の肌色から選択</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">髪型・髪色</p>
                  <p className="text-sm text-gray-600">多様な髪型と9色の髪色</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">服装</p>
                  <p className="text-sm text-gray-600">カラフルな服装を選択</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">アクセサリー</p>
                  <p className="text-sm text-gray-600">メガネ、帽子、王冠など</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                使用場面
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">マップ表示</p>
                  <p className="text-sm text-gray-600">白峰の地図上であなたの位置を表示</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">プロフィール</p>
                  <p className="text-sm text-gray-600">ダッシュボードやプロフィール画面</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">チャット</p>
                  <p className="text-sm text-gray-600">チャット画面でのアイコン表示</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">クエスト</p>
                  <p className="text-sm text-gray-600">クエスト参加時の表示</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 設定方法 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🛠️ アバター設定方法</CardTitle>
            <CardDescription>
              以下の手順でアバターをカスタマイズできます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">設定画面にアクセス</p>
                  <p className="text-sm text-gray-600 mt-1">
                    ダッシュボード → 設定画面 → プロフィール設定
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">アバター編集ボタンをクリック</p>
                  <p className="text-sm text-gray-600 mt-1">
                    現在のアバター横の「編集」ボタンをクリック
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">カスタマイズ</p>
                  <p className="text-sm text-gray-600 mt-1">
                    肌色、髪型、服装、アクセサリーを自由に組み合わせ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">保存</p>
                  <p className="text-sm text-gray-600 mt-1">
                    設定完了後「保存」ボタンで変更を確定
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="text-center space-y-4">
          <Link href="/settings/profile">
            <Button className="w-full md:w-auto">
              <Palette className="mr-2 h-4 w-4" />
              アバターを設定する
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>
              ⚠️ ゲストモードの場合、アバター設定は24時間保存されます。<br />
              長期保存には <Link href="/register" className="text-blue-600 underline">アカウント登録</Link> をお勧めします。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
