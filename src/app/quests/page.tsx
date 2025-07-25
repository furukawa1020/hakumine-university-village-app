'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

// サンプルクエストデータ
const sampleQuests = [
  {
    id: '1',
    title: '白峰地区の雪かき',
    description: '白峰地区の主要道路と歩道の雪かきを行います。地域の方々と一緒に作業することで、コミュニティとの繋がりを深めましょう。',
    startDateTime: new Date('2025-01-15T09:00:00'),
    endDateTime: new Date('2025-01-15T12:00:00'),
    place: '白峰地区コミュニティセンター',
    capacity: 10,
    participants: 7,
    difficulty: 'medium',
    category: '地域貢献',
    rewards: ['雪かき達成バッジ', '地域交流ポイント'],
    organizer: '白峰村役場',
    status: 'open',
    imageUrl: '/quest-images/snow-removal.jpg'
  },
  {
    id: '2',
    title: '薪割り体験と学習',
    description: '伝統的な薪割り技術を学び、実際に体験します。地元の職人から技術を学び、白峰の文化に触れる貴重な機会です。',
    startDateTime: new Date('2025-01-16T14:00:00'),
    endDateTime: new Date('2025-01-16T16:00:00'),
    place: '白峰伝統工芸館',
    capacity: 8,
    participants: 3,
    difficulty: 'hard',
    category: '文化体験',
    rewards: ['薪割りマスターバッジ', '文化体験ポイント'],
    organizer: '白峰伝統工芸館',
    status: 'open',
    imageUrl: '/quest-images/wood-splitting.jpg'
  },
  {
    id: '3',
    title: '山菜収穫とクッキング',
    description: '白峰の山で山菜を収穫し、地元の料理を作ります。自然の恵みを活用した料理の知識と技術を身につけましょう。',
    startDateTime: new Date('2025-01-18T10:00:00'),
    endDateTime: new Date('2025-01-18T15:00:00'),
    place: '白峰自然体験センター',
    capacity: 12,
    participants: 12,
    difficulty: 'easy',
    category: '自然体験',
    rewards: ['自然の恵みバッジ', '料理スキルポイント'],
    organizer: '白峰自然体験センター',
    status: 'full',
    imageUrl: '/quest-images/mountain-vegetables.jpg'
  },
  {
    id: '4',
    title: '地域高齢者宅お手伝い',
    description: '一人暮らしの高齢者宅で日常のお手伝いをします。買い物、掃除、話し相手など、必要な支援を提供しましょう。',
    startDateTime: new Date('2025-01-17T13:00:00'),
    endDateTime: new Date('2025-01-17T16:00:00'),
    place: '白峰地区各所',
    capacity: 6,
    participants: 1,
    difficulty: 'easy',
    category: '福祉支援',
    rewards: ['思いやりバッジ', '福祉貢献ポイント'],
    organizer: '白峰福祉協議会',
    status: 'open',
    imageUrl: '/quest-images/elderly-support.jpg'
  }
];

export default function QuestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuests, setFilteredQuests] = useState(sampleQuests);

  const categories = ['all', '地域貢献', '文化体験', '自然体験', '福祉支援'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '初級';
      case 'medium': return '中級';
      case 'hard': return '上級';
      default: return '不明';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">参加可能</span>;
      case 'full':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">満員</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">終了</span>;
      default:
        return null;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterQuests(query, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterQuests(searchQuery, category);
  };

  const filterQuests = (query: string, category: string) => {
    let filtered = sampleQuests;

    if (category !== 'all') {
      filtered = filtered.filter(quest => quest.category === category);
    }

    if (query) {
      filtered = filtered.filter(quest =>
        quest.title.toLowerCase().includes(query.toLowerCase()) ||
        quest.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredQuests(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ダッシュボード
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h1 className="text-lg font-bold text-gray-800">クエスト</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/quests/create">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                作成
              </Button>
            </Link>
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              参加履歴
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 検索・フィルター */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="クエストを検索..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>

          {/* カテゴリタブ */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? '全て' : category}
              </button>
            ))}
          </div>
        </div>

        {/* クエスト一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuests.map((quest) => (
            <Card key={quest.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(quest.difficulty)}`}>
                        {getDifficultyText(quest.difficulty)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {quest.category}
                      </span>
                      {getStatusBadge(quest.status)}
                    </div>
                    <CardTitle className="text-lg">{quest.title}</CardTitle>
                    <CardDescription className="mt-1">
                      by {quest.organizer}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {quest.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {quest.startDateTime.toLocaleDateString('ja-JP', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })} {quest.startDateTime.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {quest.endDateTime.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{quest.place}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {quest.participants}/{quest.capacity}人参加
                      {quest.status === 'full' && (
                        <span className="text-red-600 ml-1">(満員)</span>
                      )}
                    </span>
                  </div>
                </div>

                {quest.rewards && quest.rewards.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      獲得できる報酬
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {quest.rewards.map((reward, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/quests/${quest.id}`} className="flex-1">
                    <Button 
                      className="w-full" 
                      disabled={quest.status === 'full' || quest.status === 'closed'}
                    >
                      {quest.status === 'full' ? '満員' : 
                       quest.status === 'closed' ? '終了' : '詳細を見る'}
                    </Button>
                  </Link>
                  {quest.status === 'open' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              クエストが見つかりませんでした
            </h3>
            <p className="text-gray-500 mb-4">
              検索条件を変更して再度お試しください
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilteredQuests(sampleQuests);
            }}>
              フィルターをリセット
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
