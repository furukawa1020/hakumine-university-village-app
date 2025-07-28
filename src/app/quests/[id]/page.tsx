'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuestStore } from '@/stores/questStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  UserPlus,
  UserMinus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { Quest } from '@/types';

export default function QuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchQuestById, participateInQuest, cancelParticipation, deleteQuest } = useQuestStore();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const questId = params.id as string;

  useEffect(() => {
    const loadQuest = async () => {
      if (questId) {
        try {
          const questData = await fetchQuestById(questId);
          setQuest(questData);
        } catch (error) {
          console.error('クエストの取得に失敗しました:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadQuest();
  }, [questId, fetchQuestById]);

  const handleParticipate = async () => {
    if (!user || !quest) return;

    setActionLoading(true);
    try {
      await participateInQuest(quest.id, user.uid, user.displayName);
      // クエスト情報を再取得
      const updatedQuest = await fetchQuestById(quest.id);
      setQuest(updatedQuest);
    } catch (error) {
      console.error('参加に失敗しました:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelParticipation = async () => {
    if (!user || !quest) return;

    setActionLoading(true);
    try {
      await cancelParticipation(quest.id, user.uid);
      // クエスト情報を再取得
      const updatedQuest = await fetchQuestById(quest.id);
      setQuest(updatedQuest);
    } catch (error) {
      console.error('参加キャンセルに失敗しました:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuest = async () => {
    if (!user || !quest) return;
    
    // ブラウザ環境でのみconfirmを表示
    if (typeof window === 'undefined') return;
    
    const confirmDelete = window.confirm('このクエストを削除してもよろしいですか？この操作は取り消せません。');
    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      await deleteQuest(quest.id);
      router.push('/quests');
    } catch (error) {
      console.error('クエストの削除に失敗しました:', error);
      alert('クエストの削除に失敗しました');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">受付中</Badge>;
      case 'full':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">満員</Badge>;
      case 'closed':
        return <Badge variant="secondary">終了</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">簡単</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">普通</Badge>;
      case 'hard':
        return <Badge variant="default" className="bg-red-100 text-red-800 border-red-200">難しい</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const isParticipating = quest && user && quest.participantsList.some(p => p.id === user.uid);
  const canParticipate = quest && quest.status === 'open' && (!quest.capacity || quest.participants < quest.capacity);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">クエストを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">クエストが見つかりません</h1>
          <Link href="/quests">
            <Button>クエスト一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* タイトルと基本情報 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-3">{quest.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getStatusBadge(quest.status)}
                    {getDifficultyBadge(quest.difficulty)}
                    <Badge variant="outline">{quest.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center text-amber-500">
                  <Star className="h-5 w-5 mr-1" />
                  <span className="text-lg font-medium">10</span>
                </div>
              </div>
              <CardDescription className="text-lg">
                {quest.description}
              </CardDescription>
            </CardHeader>
            {quest.detailedDescription && (
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {quest.detailedDescription}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* 日時・場所情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                開催情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">開始時間</p>
                  <p className="text-gray-600">{formatDateTime(quest.startDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">終了時間</p>
                  <p className="text-gray-600">{formatDateTime(quest.endDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">場所</p>
                  <p className="text-gray-600">{quest.place}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">参加者</p>
                  <p className="text-gray-600">
                    {quest.participants} / {quest.capacity || '∞'} 人
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 参加条件・注意事項 */}
          {(quest.requirements || quest.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  参加にあたって
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quest.requirements && (
                  <div>
                    <h4 className="font-medium mb-2">参加条件・持ち物</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{quest.requirements}</p>
                  </div>
                )}
                {quest.notes && (
                  <div>
                    <h4 className="font-medium mb-2">注意事項</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{quest.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 参加ボタン */}
          <Card>
            <CardContent className="pt-6">
              {user?.isGuest ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">参加するにはログインが必要です</p>
                  <Link href="/login">
                    <Button className="w-full">ログイン</Button>
                  </Link>
                </div>
              ) : isParticipating ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">参加中</span>
                  </div>
                  <Button
                    onClick={handleCancelParticipation}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    {actionLoading ? '処理中...' : '参加をキャンセル'}
                  </Button>
                </div>
              ) : canParticipate ? (
                <Button
                  onClick={handleParticipate}
                  disabled={actionLoading}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {actionLoading ? '処理中...' : '参加する'}
                </Button>
              ) : (
                <Button disabled className="w-full">
                  {quest.status === 'full' ? '満員です' : '参加受付終了'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 管理者専用：削除ボタン */}
          {user && (quest.organizer === user.displayName || user.displayName?.includes('管理者')) && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">管理者操作</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDeleteQuest}
                  disabled={actionLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {actionLoading ? '削除中...' : 'クエストを削除'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 主催者情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">主催者</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{quest.organizer}</p>
              {quest.organizerContact && (
                <div className="space-y-2 text-sm text-gray-600">
                  {quest.organizerContact.name && (
                    <p>担当者: {quest.organizerContact.name}</p>
                  )}
                  {quest.organizerContact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${quest.organizerContact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {quest.organizerContact.email}
                      </a>
                    </div>
                  )}
                  {quest.organizerContact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${quest.organizerContact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {quest.organizerContact.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 報酬 */}
          {quest.rewards && quest.rewards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  報酬
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {quest.rewards.map((reward, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {reward}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
