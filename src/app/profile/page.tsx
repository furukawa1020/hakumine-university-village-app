'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Camera, 
  Star, 
  Calendar, 
  MapPin,
  Award,
  Target,
  MessageCircle,
  Heart,
  Edit
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { XNavigation } from '@/components/navigation/XNavigation';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const userStats = {
    questsCompleted: 47,
    totalPoints: 1450,
    daysInVillage: 12,
    friendsCount: 28,
    postsCount: 156
  };

  const achievements = [
    { name: '探検家', description: '10個のクエストを完了', icon: Target, earned: true },
    { name: '早起き鳥', description: '朝6時に5回起床', icon: Calendar, earned: true },
    { name: '交流マスター', description: '20人と交流', icon: MessageCircle, earned: false },
    { name: 'フォトグラファー', description: '100枚の写真を投稿', icon: Camera, earned: false }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* プロフィールヘッダー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.displayName || 'ユーザー名'}
              </h1>
              <p className="text-gray-600 text-sm">{(user && 'email' in user) ? user.email : 'メールアドレス'}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  白峰村滞在中
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {userStats.daysInVillage}日目
                </Badge>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{userStats.questsCompleted}</div>
            <div className="text-xs text-gray-600">クエスト完了</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</div>
            <div className="text-xs text-gray-600">ポイント</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{userStats.friendsCount}</div>
            <div className="text-xs text-gray-600">友達</div>
          </CardContent>
        </Card>
      </div>

      {/* 実績 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>実績</span>
          </CardTitle>
          <CardDescription>
            あなたの白峰村での活動実績
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  achievement.earned 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Badge variant="secondary" className="text-xs">
                    達成済み
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* アクションカード */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">設定</h3>
            <p className="text-xs text-gray-600 mt-1">プロフィール・通知設定</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">マイクエスト</h3>
            <p className="text-xs text-gray-600 mt-1">進行中のクエスト確認</p>
          </CardContent>
        </Card>
      </div>

      {/* レベルプログレス */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">村民レベル</CardTitle>
          <CardDescription>
            次のレベルまであと350ポイント
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">レベル 7</span>
            <span className="text-sm font-medium text-gray-700">レベル 8</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>1,450 / 1,800 ポイント</span>
            <span>80%</span>
          </div>
        </CardContent>
      </Card>
      <XNavigation />
    </div>
  );
}
