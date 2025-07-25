'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// アバターパーツのデータ
const avatarParts = {
  face: [
    { id: 0, name: '基本', color: '#ffdbac' },
    { id: 1, name: '笑顔', color: '#ffdbac' },
    { id: 2, name: 'ウインク', color: '#ffdbac' },
    { id: 3, name: 'クール', color: '#ffdbac' }
  ],
  hair: [
    { id: 0, name: 'ショート', color: '#8b4513' },
    { id: 1, name: 'ロング', color: '#8b4513' },
    { id: 2, name: 'カーリー', color: '#8b4513' },
    { id: 3, name: 'ポニーテール', color: '#8b4513' }
  ],
  body: [
    { id: 0, name: '白シャツ', color: '#ffffff' },
    { id: 1, name: '青シャツ', color: '#4a90e2' },
    { id: 2, name: '緑シャツ', color: '#7ed321' },
    { id: 3, name: '赤シャツ', color: '#d0021b' }
  ],
  accessory: [
    { id: 0, name: 'なし', color: 'transparent' },
    { id: 1, name: 'メガネ', color: '#333333' },
    { id: 2, name: '帽子', color: '#8b4513' },
    { id: 3, name: 'マフラー', color: '#ff6b6b' }
  ]
};

// シンプルなドット風アバター表示コンポーネント
function AvatarPreview({ config }: { config: { face: number; hair: number; body: number; accessory: number } }) {
  return (
    <div className="w-32 h-32 mx-auto relative">
      {/* 背景（顔） */}
      <div 
        className="w-24 h-24 absolute top-2 left-4 rounded-full"
        style={{ backgroundColor: avatarParts.face[config.face]?.color || '#ffdbac' }}
      />
      
      {/* 髪 */}
      <div 
        className="w-28 h-16 absolute top-0 left-2 rounded-t-full"
        style={{ backgroundColor: avatarParts.hair[config.hair]?.color || '#8b4513' }}
      />
      
      {/* 体 */}
      <div 
        className="w-20 h-24 absolute top-20 left-6 rounded-lg"
        style={{ backgroundColor: avatarParts.body[config.body]?.color || '#ffffff' }}
      />
      
      {/* アクセサリー */}
      {config.accessory > 0 && (
        <div 
          className="w-12 h-8 absolute top-8 left-10 rounded"
          style={{ backgroundColor: avatarParts.accessory[config.accessory]?.color || '#333333' }}
        />
      )}
      
      {/* 目 */}
      <div className="w-2 h-2 bg-black rounded-full absolute top-8 left-8" />
      <div className="w-2 h-2 bg-black rounded-full absolute top-8 left-16" />
      
      {/* 口 */}
      <div className="w-4 h-1 bg-black rounded absolute top-14 left-12" />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [avatarConfig, setAvatarConfig] = useState({
    face: 0,
    hair: 0,
    body: 0,
    accessory: 0
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'ようこそ！', subtitle: '白峰大学村アプリへようこそ！まずはアバターを作成しましょう。' },
    { title: '顔を選択', subtitle: 'あなたのアバターの表情を選んでください' },
    { title: '髪型を選択', subtitle: 'お気に入りの髪型を選んでください' },
    { title: '服装を選択', subtitle: '着たい服装を選んでください' },
    { title: 'アクセサリー', subtitle: '最後にアクセサリーを選んでください（なしでもOK）' },
    { title: '完成！', subtitle: 'あなただけのアバターが完成しました！' }
  ];

  const handlePartSelect = (partType: keyof typeof avatarConfig, partId: number) => {
    setAvatarConfig(prev => ({
      ...prev,
      [partType]: partId
    }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Firestoreでユーザー情報を更新
      await updateDoc(doc(db, 'users', user.uid), {
        avatarConfig,
        updatedAt: new Date()
      });

      // ローカルストアも更新
      setUser({
        ...user,
        avatarConfig,
        lastActiveAt: new Date()
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Avatar update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <div className="mb-8">
              <Mountain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                白峰大学村へようこそ！
              </h2>
              <p className="text-gray-600">
                まずはあなたのアバターを作成して、白峰での生活を始めましょう。
                アバターは後からいつでも変更できます。
              </p>
            </div>
            <AvatarPreview config={avatarConfig} />
          </div>
        );

      case 1:
        return (
          <div>
            <div className="mb-6">
              <AvatarPreview config={avatarConfig} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {avatarParts.face.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect('face', part.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    avatarConfig.face === part.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: part.color }}
                  />
                  <span className="text-sm font-medium">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-6">
              <AvatarPreview config={avatarConfig} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {avatarParts.hair.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect('hair', part.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    avatarConfig.hair === part.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-t-full mx-auto mb-2"
                    style={{ backgroundColor: part.color }}
                  />
                  <span className="text-sm font-medium">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="mb-6">
              <AvatarPreview config={avatarConfig} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {avatarParts.body.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect('body', part.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    avatarConfig.body === part.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded mx-auto mb-2"
                    style={{ backgroundColor: part.color }}
                  />
                  <span className="text-sm font-medium">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="mb-6">
              <AvatarPreview config={avatarConfig} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {avatarParts.accessory.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect('accessory', part.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    avatarConfig.accessory === part.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded mx-auto mb-2"
                    style={{ 
                      backgroundColor: part.color,
                      border: part.color === 'transparent' ? '2px dashed #ccc' : 'none'
                    }}
                  />
                  <span className="text-sm font-medium">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <div className="mb-8">
              <AvatarPreview config={avatarConfig} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">
                アバター完成！
              </h2>
              <p className="text-gray-600">
                素敵なアバターが完成しました！いつでも設定から変更できます。
                さあ、白峰大学村での生活を始めましょう！
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].subtitle}</CardDescription>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
              
              {step < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  次へ
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? '保存中...' : '完了'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
