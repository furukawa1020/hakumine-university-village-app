'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Plus,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function CreateQuestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [questData, setQuestData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    capacity: '',
    difficulty: 'easy',
    category: '地域貢献',
    rewards: [] as string[],
    requirements: ''
  });
  const [newReward, setNewReward] = useState('');

  const categories = ['地域貢献', '文化体験', '自然体験', '福祉支援', '学習・研究', 'その他'];

  const handleInputChange = (field: string, value: string) => {
    setQuestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addReward = () => {
    if (newReward.trim()) {
      setQuestData(prev => ({
        ...prev,
        rewards: [...prev.rewards, newReward.trim()]
      }));
      setNewReward('');
    }
  };

  const removeReward = (index: number) => {
    setQuestData(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ここで実際のクエスト作成処理を実装
      const newQuest = {
        ...questData,
        id: Date.now().toString(),
        organizer: user?.displayName || '匿名ユーザー',
        participants: 0,
        status: 'open',
        createdAt: new Date(),
        createdBy: user?.uid
      };

      console.log('New quest created:', newQuest);
      
      // 実際の実装では Firestore に保存
      // await addDoc(collection(db, 'quests'), newQuest);

      // 成功メッセージ表示（実装省略）
      router.push('/quests');
    } catch (error) {
      console.error('Quest creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/quests">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                クエスト一覧
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">新しいクエストを作成</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              クエスト作成
            </CardTitle>
            <CardDescription>
              白峰での新しい活動・体験を企画して、みんなで一緒に楽しみましょう！
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">基本情報</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    クエスト名 *
                  </label>
                  <Input
                    value={questData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="例: みんなで雪だるま作り"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    詳細説明 *
                  </label>
                  <textarea
                    value={questData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="クエストの内容、持ち物、注意事項などを詳しく記載してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリ *
                    </label>
                    <select
                      value={questData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      難易度 *
                    </label>
                    <select
                      value={questData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="easy">初級</option>
                      <option value="medium">中級</option>
                      <option value="hard">上級</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 日時・場所 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">日時・場所</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始日 *
                    </label>
                    <Input
                      type="date"
                      value={questData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始時刻 *
                    </label>
                    <Input
                      type="time"
                      value={questData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了日 *
                    </label>
                    <Input
                      type="date"
                      value={questData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了時刻 *
                    </label>
                    <Input
                      type="time"
                      value={questData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    開催場所 *
                  </label>
                  <Input
                    value={questData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="例: 白峰コミュニティセンター前"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="inline h-4 w-4 mr-1" />
                    定員 *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={questData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="例: 10"
                    required
                  />
                </div>
              </div>

              {/* 報酬・特典 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">報酬・特典</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Star className="inline h-4 w-4 mr-1" />
                    獲得できる報酬
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newReward}
                      onChange={(e) => setNewReward(e.target.value)}
                      placeholder="例: 雪だるま作成バッジ"
                    />
                    <Button type="button" onClick={addReward} size="sm">
                      追加
                    </Button>
                  </div>
                  
                  {questData.rewards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {questData.rewards.map((reward, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                        >
                          {reward}
                          <button
                            type="button"
                            onClick={() => removeReward(index)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 参加条件 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">参加条件・その他</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    参加条件・持ち物
                  </label>
                  <textarea
                    value={questData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="特別な持ち物、スキル要件、参加条件があれば記載してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-4 pt-4">
                <Link href="/quests" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    キャンセル
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    '作成中...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      クエストを作成
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
