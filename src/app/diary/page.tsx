'use client';

import { useState, useEffect } from 'react';
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
import { useDiaryStore } from '@/stores/diaryStore';
import { XNavigation } from '@/components/navigation/XNavigation';

export default function DiaryPage() {
  const { user } = useAuthStore();
  const {
    entries,
    loading,
    fetchEntries,
    createEntry,
    likeEntry,
    unlikeEntry
  } = useDiaryStore();

  const [selectedTab, setSelectedTab] = useState<'mine' | 'all'>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'limited' | 'private'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryVisibility, setNewEntryVisibility] = useState<'public' | 'limited' | 'private'>('public');

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleCreateEntry = async () => {
    if (!user || !newEntryTitle.trim() || !newEntryContent.trim()) return;

    try {
      await createEntry({
        title: newEntryTitle,
        content: newEntryContent,
        date: new Date(),
        visibility: newEntryVisibility,
        tags: [],
        mood: 'happy',
        weather: 'sunny'
      });
      
      setShowCreateModal(false);
      setNewEntryTitle('');
      setNewEntryContent('');
      setNewEntryVisibility('public');
      
      // エントリーを再取得
      fetchEntries();
    } catch (error) {
      console.error('日記エントリーの作成に失敗しました:', error);
    }
  };

  const handleLikeToggle = async (entryId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await unlikeEntry(entryId, user.uid);
      } else {
        await likeEntry(entryId, user.uid);
      }
    } catch (error) {
      console.error('いいねの処理に失敗しました:', error);
    }
  };

  // 検索とフィルタリング
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility = selectedVisibility === 'all' || entry.visibility === selectedVisibility;
    return matchesSearch && matchesVisibility;
  });

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

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">日記を読み込み中...</p>
        </div>
      </div>
    );
  }

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
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新しい日記
            </Button>
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
                私の日記 ({filteredEntries.filter(entry => entry.authorId === user?.uid).length})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                みんなの日記 ({filteredEntries.length})
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
                        {entry.authorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{entry.authorName}</span>
                        <span>•</span>
                        <span>{new Date(entry.date).toLocaleDateString('ja-JP')}</span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getWeatherEmoji(entry.weather || '晴れ')}</span>
                    <span className="text-lg">{getMoodEmoji(entry.mood || 'happy')}</span>
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
                      <button 
                        onClick={() => handleLikeToggle(entry.id, entry.likedBy.includes(user?.uid || ''))}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          entry.likedBy.includes(user?.uid || '') 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${entry.likedBy.includes(user?.uid || '') ? 'fill-current' : ''}`} />
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

      {/* 日記作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>新しい日記を書く</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <Input
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  placeholder="タイトルを入力してください"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">内容</label>
                <textarea
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  placeholder="今日の出来事や思ったことを書いてください..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">公開設定</label>
                <select
                  value={newEntryVisibility}
                  onChange={(e) => setNewEntryVisibility(e.target.value as 'public' | 'limited' | 'private')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="public">公開</option>
                  <option value="limited">限定公開</option>
                  <option value="private">非公開</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  キャンセル
                </Button>
                <Button 
                  onClick={handleCreateEntry} 
                  className="flex-1"
                  disabled={!newEntryTitle.trim() || !newEntryContent.trim()}
                >
                  投稿
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <XNavigation />
    </div>
  );
}
