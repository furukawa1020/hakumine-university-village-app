'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AvatarSettingsPage() {
  const [selectedStyle, setSelectedStyle] = useState('default');

  const avatarStyles = [
    { id: 'default', name: 'デフォルト', preview: '👤' },
    { id: 'casual', name: 'カジュアル', preview: '😊' },
    { id: 'formal', name: 'フォーマル', preview: '😎' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">アバター設定</h1>
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>アバタースタイル選択</CardTitle>
            <CardDescription>
              お好みのアバタースタイルを選択してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {avatarStyles.map((style) => (
              <div
                key={style.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedStyle === style.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{style.preview}</div>
                  <div>
                    <h3 className="font-medium">{style.name}</h3>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Button className="w-full">
                設定を保存
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}