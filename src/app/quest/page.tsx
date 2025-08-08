'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Clock, 
  Users, 
  Star, 
  CheckCircle,
  PlayCircle,
  MapPin
} from 'lucide-react';
import { XNavigation } from '@/components/navigation/XNavigation';

const sampleQuests = [
  {
    id: 1,
    title: '白峰の歴史を学ぼう',
    description: '白峰地区の歴史的建造物を3つ以上見学し、写真を撮影してください',
    difficulty: 'Easy',
    points: 100,
    participants: 12,
    timeLimit: '3日',
    status: 'available',
    category: '文化'
  },
  {
    id: 2,
    title: '朝の散歩チャレンジ',
    description: '早朝6時に起床し、村内を30分以上散歩しましょう',
    difficulty: 'Medium',
    points: 150,
    participants: 8,
    timeLimit: '1日',
    status: 'in-progress',
    category: '健康'
  },
  {
    id: 3,
    title: '地域交流プロジェクト',
    description: '地元住民の方とお話しし、白峰の魅力について聞いてみましょう',
    difficulty: 'Hard',
    points: 300,
    participants: 5,
    timeLimit: '1週間',
    status: 'available',
    category: '交流'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available': return <PlayCircle className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

export default function QuestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">クエスト</h1>
        <p className="text-sm text-gray-600 mt-1">楽しいミッションで村を探索しよう</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">進行中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">47</div>
            <div className="text-xs text-gray-600">完了済み</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,450</div>
            <div className="text-xs text-gray-600">総ポイント</div>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリーフィルター */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Badge variant="default" className="whitespace-nowrap">すべて</Badge>
        <Badge variant="outline" className="whitespace-nowrap">文化</Badge>
        <Badge variant="outline" className="whitespace-nowrap">健康</Badge>
        <Badge variant="outline" className="whitespace-nowrap">交流</Badge>
        <Badge variant="outline" className="whitespace-nowrap">自然</Badge>
      </div>

      {/* クエスト一覧 */}
      <div className="space-y-4">
        {sampleQuests.map((quest) => (
          <Card key={quest.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                  <CardDescription className="mt-1">{quest.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(quest.difficulty)}>
                  {quest.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{quest.points}pt</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{quest.participants}人参加</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{quest.timeLimit}</span>
                  </div>
                </div>
                <Button size="sm" className="flex items-center space-x-1">
                  {getStatusIcon(quest.status)}
                  <span>
                    {quest.status === 'available' ? '開始' : 
                     quest.status === 'in-progress' ? '続行' : '完了'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* クエスト作成ボタン */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-purple-400 transition-colors">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">新しいクエストを提案</h3>
          <p className="text-sm text-gray-600 mb-4">
            あなたのアイデアで楽しいクエストを作成しましょう
          </p>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            クエストを作成
          </Button>
        </CardContent>
      </Card>
      </div>

      {/* X風ナビゲーション */}
      <XNavigation />
    </div>
  );
}
