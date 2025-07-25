'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function CreateQuestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    startDateTime: '',
    endDateTime: '',
    place: '',
    capacity: '',
    category: '地域貢献',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    requirements: '',
    notes: '',
    organizer: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: ''
  });

  // ゲストユーザーの場合はリダイレクト
  if (user?.isGuest) {
    router.push('/quests');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: 実際のFirestore保存処理を実装
      console.log('Creating quest:', formData);
      
      // デモ用の遅延
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/quests');
    } catch (error) {
      console.error('クエストの作成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    '地域貢献',
    '環境保護',
    '文化交流',
    'スポーツ',
    '教育・学習',
    'その他'
  ];

  const difficulties = [
    { value: 'easy', label: '簡単', color: 'text-green-600' },
    { value: 'medium', label: '普通', color: 'text-yellow-600' },
    { value: 'hard', label: '難しい', color: 'text-red-600' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/quests">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">新しいクエストを作成</h1>
          <p className="text-gray-600 mt-2">コミュニティのためのクエストを作成しましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              基本情報
            </CardTitle>
            <CardDescription>
              クエストの基本的な情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="クエストのタイトルを入力"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">概要 *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="クエストの簡単な説明を入力"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">詳細説明</Label>
              <Textarea
                id="detailedDescription"
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                placeholder="クエストの詳細な説明、注意事項などを入力"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">難易度 *</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 日時・場所 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              日時・場所
            </CardTitle>
            <CardDescription>
              クエストの実施日時と場所を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDateTime">開始日時 *</Label>
                <Input
                  id="startDateTime"
                  name="startDateTime"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDateTime">終了日時 *</Label>
                <Input
                  id="endDateTime"
                  name="endDateTime"
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">開催場所 *</Label>
              <Input
                id="place"
                name="place"
                value={formData.place}
                onChange={handleInputChange}
                placeholder="集合場所や開催場所を入力"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">定員</Label>
              <Input
                id="capacity" 
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="参加人数の上限を設定（空白の場合は無制限）"
                min="1"
              />
            </div>
          </CardContent>
        </Card>

        {/* 主催者情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              主催者情報
            </CardTitle>
            <CardDescription>
              参加者が連絡できるよう、主催者の情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizer">主催者・団体名 *</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="主催者または団体名を入力"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizerName">担当者名</Label>
                <Input
                  id="organizerName"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleInputChange}
                  placeholder="担当者名を入力"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizerEmail">連絡先メール</Label>
                <Input
                  id="organizerEmail"
                  name="organizerEmail"
                  type="email"
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                  placeholder="連絡先メールアドレス"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizerPhone">電話番号</Label>
              <Input
                id="organizerPhone"
                name="organizerPhone"
                type="tel"
                value={formData.organizerPhone}
                onChange={handleInputChange}
                placeholder="連絡先電話番号"
              />
            </div>
          </CardContent>
        </Card>

        {/* 追加情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              追加情報
            </CardTitle>
            <CardDescription>
              参加条件や注意事項などを記載してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="requirements">参加条件・必要な持ち物</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="年齢制限、必要な持ち物、スキルなどがあれば記載"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備考・注意事項</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="天候による中止の可能性、駐車場情報など"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/quests">
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? '作成中...' : 'クエストを作成'}
          </Button>
        </div>
      </form>
    </div>
  );
}
