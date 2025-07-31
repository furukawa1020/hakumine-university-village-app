'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // パスワードリセット機能は今後実装
      setMessage('パスワードリセット機能は準備中です。お問い合わせください。');
    } catch (error) {
      setMessage('エラーが発生しました。しばらく後にお試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2 mb-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ログインに戻る
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">パスワードをお忘れですか？</CardTitle>
          <CardDescription className="text-center">
            登録されたメールアドレスにパスワードリセットのリンクをお送りします
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('エラー') 
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? '送信中...' : 'リセットリンクを送信'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>アカウントをお持ちでない場合</p>
            <Link href="/register" className="text-blue-600 hover:underline">
              新規登録はこちら
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
