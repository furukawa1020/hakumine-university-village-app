'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Clock, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useQuestStore } from '@/stores/questStore';

interface QuestDetailPageProps {
  params: {
    id: string;
  };
}

export default function QuestDetailPage({ params }: QuestDetailPageProps) {
  const { user } = useAuthStore();
  const { fetchQuestById, participateInQuest, cancelParticipation, loading } = useQuestStore();
  const router = useRouter();
  const [quest, setQuest] = useState<any>(null);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    const loadQuest = async () => {
      const questData = await fetchQuestById(params.id);
      if (questData) {
        setQuest(questData);
        // ユーザーが既に参加しているかチェック
        if (user) {
          const isAlreadyParticipating = questData.participantsList.some(p => p.id === user.uid);
          setIsParticipating(isAlreadyParticipating);
        }
      }
    };
    
    loadQuest();
  }, [params.id, user, fetchQuestById]);

  const handleParticipate = async () => {
    if (!user || !quest) return;

    try {
      await participateInQuest(quest.id, user.uid, user.displayName || 'Unknown User');
      setIsParticipating(true);
      
      // クエストデータを再取得して最新状態を反映
      const updatedQuest = await fetchQuestById(quest.id);
      if (updatedQuest) {
        setQuest(updatedQuest);
      }
    } catch (error) {
      console.error('Error participating in quest:', error);
      alert('参加登録に失敗しました。もう一度お試しください。');
    }
  };

  const handleCancelParticipation = async () => {
    if (!user || !quest) return;

    try {
      await cancelParticipation(quest.id, user.uid);
      setIsParticipating(false);
      
      // クエストデータを再取得して最新状態を反映
      const updatedQuest = await fetchQuestById(quest.id);
      if (updatedQuest) {
        setQuest(updatedQuest);
      }
    } catch (error) {
      console.error('Error cancelling participation:', error);
      alert('参加キャンセルに失敗しました。もう一度お試しください。');
    }
  };

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">クエストが見つかりません</h2>
          <p className="text-gray-500 mb-4">指定されたクエストは存在しないか、削除された可能性があります。</p>
          <Link href="/quests">
            <Button>クエスト一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const isQuestFull = quest.participants >= quest.capacity;
  const canParticipate = quest.status === 'open' && !isQuestFull && !isParticipating;
  const isQuestPast = quest.startDateTime < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/quests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              クエスト一覧
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800">クエスト詳細</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* クエスト基本情報 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(quest.difficulty)}`}>
                        {getDifficultyText(quest.difficulty)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {quest.category}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{quest.title}</CardTitle>
                    <CardDescription className="mt-2">
                      主催: {quest.organizer}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        {quest.startDateTime.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </div>
                      <div className="text-gray-600">
                        {quest.startDateTime.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {quest.endDateTime.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium">開催場所</div>
                      <div className="text-gray-600">{quest.place}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">参加者数</div>
                      <div className="text-gray-600">
                        {quest.participants}/{quest.capacity}人
                        {isQuestFull && <span className="text-red-600 ml-1">(満員)</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">クエスト詳細</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {quest.detailedDescription}
                  </div>
                </div>

                {quest.requirements && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">参加要件・持ち物</h4>
                    <p className="text-yellow-700">{quest.requirements}</p>
                  </div>
                )}

                {quest.notes && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">注意事項</h4>
                    <p className="text-blue-700">{quest.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 報酬 */}
            {quest.rewards && quest.rewards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    獲得できる報酬
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {quest.rewards.map((reward: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 参加者一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>参加者一覧 ({quest.participants}人)</CardTitle>
              </CardHeader>
              <CardContent>
                {quest.participantsList.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {quest.participantsList.map((participant: any, index: number) => (
                      <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(participant.joinedAt).toLocaleDateString('ja-JP')} 参加
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">まだ参加者がいません</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 参加ボタン */}
              <Card>
                <CardContent className="p-6">
                  {!user ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">参加するにはログインが必要です</p>
                      <Link href="/login">
                        <Button className="w-full">ログイン</Button>
                      </Link>
                    </div>
                  ) : isQuestPast ? (
                    <Button disabled className="w-full">
                      開催終了
                    </Button>
                  ) : isParticipating ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">参加登録済み</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCancelParticipation}
                        disabled={loading}
                      >
                        {loading ? '処理中...' : '参加をキャンセル'}
                      </Button>
                    </div>
                  ) : canParticipate ? (
                    <Button
                      className="w-full"
                      onClick={handleParticipate}
                      disabled={loading}
                    >
                      {loading ? '参加登録中...' : 'このクエストに参加する'}
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      {isQuestFull ? '定員に達しました' : '参加受付終了'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* 主催者情報 */}
              <Card>
                <CardHeader>
                  <CardTitle>主催者情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span>{quest.organizerContact.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <a href={`mailto:${quest.organizerContact.email}`} className="text-blue-600 hover:underline">
                      {quest.organizerContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <a href={`tel:${quest.organizerContact.phone}`} className="text-blue-600 hover:underline">
                      {quest.organizerContact.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
