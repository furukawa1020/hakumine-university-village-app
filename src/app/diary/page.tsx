'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Lock,
  Globe,
  Heart,
  MessageCircle,
  Share,
  Camera,
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { XNavigation } from '@/components/navigation/XNavigation';

export default function DiaryPage() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'mine' | 'all'>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'limited' | 'private'>('all');

  // サンプル日記データ（useAuthStore後に移動）
  const sampleDiaryEntries = [
    {
      id: '1',
      title: '初めての雪かき体験',
      content: '今日は白峰で初めての雪かきを体験しました。想像していたよりもずっと大変でしたが、地域の方々と一緒に作業することで、コミュニティの温かさを感じることができました。特に、お隣の田中おじいさんが教えてくれた効率的な雪かきのコツは本当に役に立ちました。\n\n作業後に飲んだ温かいお茶の美味しさは格別で、みんなで頑張った達成感と一緒に心に残っています。明日筋肉痛になりそうですが、また参加したいと思います。',
      date: new Date('2025-01-13T18:30:00'),
      visibility: 'public',
      tags: ['雪かき', '地域交流', '初体験'],
      images: ['/diary-images/snow-removal-1.jpg'],
      likes: 8,
      comments: 3,
      author: {
        name: user?.displayName || 'あなた',
        avatar: '/avatars/current-user.jpg'
      },
      weather: '雪',
      mood: 'happy'
    },
    {
      id: '2',
      title: '白峰の夜空と満天の星',
      content: '都市部では決して見ることのできない満天の星空を見ることができました。空気が澄んでいて、天の川もはっきりと見えます。\n\n地元の方に教えてもらった星座の話も興味深く、白峰の自然の豊かさを改めて実感しました。写真では伝わらない美しさですが、この感動を記録に残しておきたいと思います。',
      date: new Date('2025-01-12T22:15:00'),
      visibility: 'limited',
      tags: ['星空', '自然', '感動'],
      images: ['/diary-images/starry-sky.jpg'],
      likes: 12,
      comments: 5,
      author: {
        name: user?.displayName || 'あなた',
        avatar: '/avatars/current-user.jpg'
      },
      weather: '晴れ',
      mood: 'peaceful'
    },
    {
      id: '3',
      title: '薪割りに挑戦！',
      content: '白峰伝統工芸館で薪割り体験をしてきました。最初は全然斧が当たらなくて、職人さんに笑われてしまいました😅\n\nでも、コツを教えてもらってからは徐々に上達して、最後には綺麗に割ることができるように！達成感がすごかったです。',
      date: new Date('2025-01-11T16:00:00'),
      visibility: 'public',
      tags: ['薪割り', '文化体験', '達成感'],
      images: [],
      likes: 6,
      comments: 2,
      author: {
        name: user?.displayName || 'あなた',
        avatar: '/avatars/current-user.jpg'
      },
      weather: '曇り',
      mood: 'excited'
    }
  ];

  // 他のユーザーの日記（サンプル）
  const sampleOtherEntries = [
    {
      id: '4',
      title: 'おばあちゃんとの料理教室',
      content: '地域のおばあちゃんに郷土料理を教えてもらいました。手作りの温かさを感じられる素敵な時間でした。',
      date: new Date('2025-01-13T14:00:00'),
      visibility: 'public',
      tags: ['料理', '地域交流', '郷土料理'],
      images: ['/diary-images/cooking.jpg'],
      likes: 15,
      comments: 8,
      author: {
        name: '田中さん',
        avatar: '/avatars/tanaka.jpg'
      },
      weather: '晴れ',
      mood: 'happy'
    },
    {
      id: '5',
      title: '温泉で癒やされました',
      content: '白峰の温泉は本当に最高です！疲れが一気に取れました♨️',
      date: new Date('2025-01-12T19:30:00'),
      visibility: 'public',
      tags: ['温泉', 'リラックス'],
      images: [],
      likes: 9,
      comments: 4,
      author: {
        name: '佐藤さん',
        avatar: '/avatars/sato.jpg'
      },
      weather: '雪',
      mood: 'relaxed'
    }
  ];

  const myEntries = sampleDiaryEntries;
  const allEntries = [...sampleDiaryEntries, ...sampleOtherEntries].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4 text-blue-600" />;
      case 'limited': return <Users className="h-4 w-4 text-yellow-600" />;
      case 'private': return <Lock className="h-4 w-4 text-gray-600" />;
      default: return <Globe className="h-4 w-4 text-blue-600" />;
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'public': return '公開';
      case 'limited': return '限定公開';
      case 'private': return '非公開';
      default: return '公開';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'excited': return '😄';
      case 'peaceful': return '😌';
      case 'relaxed': return '😊';
      default: return '😊';
    }
  };

  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case '晴れ': return '☀️';
      case '曇り': return '☁️';
      case '雪': return '❄️';
      case '雨': return '🌧️';
      default: return '☀️';
    }
  };

  const filteredEntries = (selectedTab === 'mine' ? myEntries : allEntries)
    .filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesVisibility = selectedVisibility === 'all' || entry.visibility === selectedVisibility;
      
      return matchesSearch && matchesVisibility;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 pb-20">
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
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <h1 className="text-lg font-bold text-gray-800">日記</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              カレンダー表示
            </Button>
            <Link href="/diary/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新しい日記
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* タブとフィルター */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* タブ */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setSelectedTab('mine')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'mine'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                私の日記 ({myEntries.length})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                みんなの日記 ({allEntries.length})
              </button>
            </div>

            {/* 検索 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="日記を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* フィルター */}
            <div className="flex gap-2">
              <select
                value={selectedVisibility}
                onChange={(e) => setSelectedVisibility(e.target.value as 'all' | 'public' | 'limited' | 'private')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ての公開設定</option>
                <option value="public">公開</option>
                <option value="limited">限定公開</option>
                <option value="private">非公開</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                その他
              </Button>
            </div>
          </div>
        </div>

        {/* 日記一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {entry.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{entry.author.name}</span>
                        <span>•</span>
                        <span>{entry.date.toLocaleDateString('ja-JP')}</span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getWeatherEmoji(entry.weather)}</span>
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    {selectedTab === 'mine' && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {getVisibilityIcon(entry.visibility)}
                        <span>{getVisibilityText(entry.visibility)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* 画像 */}
                  {entry.images && entry.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {entry.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 内容 */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {entry.content}
                    </p>
                    
                    {/* タグ */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* アクション */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{entry.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{entry.comments}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <Share className="h-4 w-4" />
                        <span>共有</span>
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/diary/${entry.id}`}>
                        <Button size="sm" variant="outline">
                          読む
                        </Button>
                      </Link>
                      {selectedTab === 'mine' && (
                        <Link href={`/diary/${entry.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {selectedTab === 'mine' ? '日記がありません' : '表示する日記がありません'}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedTab === 'mine' 
                ? '新しい日記を書いて、白峰での体験を記録しましょう'
                : '検索条件を変更して再度お試しください'
              }
            </p>
            {selectedTab === 'mine' ? (
              <Link href="/diary/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  日記を書く
                </Button>
              </Link>
            ) : (
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedVisibility('all');
              }}>
                フィルターをリセット
              </Button>
            )}
          </div>
        )}
      </div>
      <XNavigation />
    </div>
  );
}
