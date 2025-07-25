'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mountain, Mail, Lock, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // バリデーション
      if (formData.password !== formData.confirmPassword) {
        throw new Error('パスワードが一致しません');
      }

      if (formData.password.length < 6) {
        throw new Error('パスワードは6文字以上で入力してください');
      }

      // ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // プロフィール更新
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Firestoreにユーザー情報保存
      const userData = {
        uid: user.uid,
        email: user.email!,
        displayName: formData.displayName,
        photoURL: '',
        avatarConfig: {
          face: 0,
          hair: 0,
          body: 0,
          accessory: 0
        },
        settings: {
          privacy: {
            showLocation: false,
            locationPrecision: 'area' as const,
            profileVisibility: 'public' as const,
            logVisibility: 'public' as const,
            locationSharing: false,
            locationGranularity: 'rough' as const
          },
          notifications: {
            questNotifications: true,
            chatNotifications: true,
            systemNotifications: true,
            emailNotifications: true
          }
        },
        status: 'offline' as const,
        joinedAt: new Date(),
        lastActiveAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // ユーザー情報をストアに保存
      setUser(userData);

      router.push('/onboarding');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          setError('このメールアドレスは既に使用されています');
        } else if (error.message.includes('weak-password')) {
          setError('パスワードが弱すぎます。より強固なパスワードを設定してください');
        } else {
          setError(error.message);
        }
      } else {
        setError('アカウント作成に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="h-4 w-4" />
            トップページに戻る
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">白峰大学村</h1>
          </div>
          <p className="text-gray-600">新しいアカウントを作成</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">新規登録</CardTitle>
            <CardDescription className="text-center">
              メールアドレスでアカウントを作成してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="山田太郎"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.name@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="パスワードを入力（6文字以上）"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（確認）
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="パスワードを再入力"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'アカウント作成中...' : 'アカウントを作成'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                既にアカウントをお持ちの方は{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  ログインページへ
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>学生専用サービス:</strong> このアプリは白峰大学村参加学生専用のクローズドコミュニティです。
                メールアドレス認証で安心してご利用いただけます。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
