'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar as CalendarIcon, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

// サンプル予定データ
const sampleEvents = [
  {
    id: '1',
    title: '雪かきクエスト',
    type: 'quest',
    date: new Date('2025-01-15T09:00:00'),
    endDate: new Date('2025-01-15T12:00:00'),
    location: '白峰地区コミュニティセンター',
    participants: 7,
    maxParticipants: 10,
    color: 'bg-green-500',
    description: '白峰地区の主要道路と歩道の雪かきを行います。'
  },
  {
    id: '2',
    title: '薪割り体験',
    type: 'quest',
    date: new Date('2025-01-16T14:00:00'),
    endDate: new Date('2025-01-16T16:00:00'),
    location: '白峰伝統工芸館',
    participants: 3,
    maxParticipants: 8,
    color: 'bg-blue-500',
    description: '伝統的な薪割り技術を学び、実際に体験します。'
  },
  {
    id: '3',
    title: '個人的な用事',
    type: 'personal',
    date: new Date('2025-01-17T10:00:00'),
    endDate: new Date('2025-01-17T11:00:00'),
    location: '白峰郵便局',
    color: 'bg-purple-500',
    description: '郵便物の受け取り'
  },
  {
    id: '4',
    title: '地域高齢者宅お手伝い',
    type: 'quest',
    date: new Date('2025-01-17T13:00:00'),
    endDate: new Date('2025-01-17T16:00:00'),
    location: '白峰地区各所',
    participants: 1,
    maxParticipants: 6,
    color: 'bg-yellow-500',
    description: '一人暮らしの高齢者宅で日常のお手伝いをします。'
  },
  {
    id: '5',
    title: '山菜収穫とクッキング',
    type: 'quest',
    date: new Date('2025-01-18T10:00:00'),
    endDate: new Date('2025-01-18T15:00:00'),
    location: '白峰自然体験センター',
    participants: 12,
    maxParticipants: 12,
    color: 'bg-green-500',
    description: '白峰の山で山菜を収穫し、地元の料理を作ります。'
  },
  {
    id: '6',
    title: '友達との温泉',
    type: 'personal',
    date: new Date('2025-01-19T16:00:00'),
    endDate: new Date('2025-01-19T18:00:00'),
    location: '白峰温泉',
    color: 'bg-pink-500',
    description: '大学の友達と温泉でリラックス'
  }
];

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [showQuestEvents, setShowQuestEvents] = useState(true);
  const [showPersonalEvents, setShowPersonalEvents] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // 前月の日付を追加
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // 今月の日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // 次月の日付を追加（42日分まで）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const getDayEvents = (date: Date) => {
    return sampleEvents.filter(event => {
      const eventDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const typeFilter = 
        (event.type === 'quest' && showQuestEvents) ||
        (event.type === 'personal' && showPersonalEvents);
      
      return eventDate.getTime() === targetDate.getTime() && typeFilter;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const calendarDays = generateCalendarDays();

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'quest': return <BookOpen className="h-3 w-3" />;
      case 'personal': return <Clock className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
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
              <CalendarIcon className="h-6 w-6 text-purple-600" />
              <h1 className="text-lg font-bold text-gray-800">カレンダー</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              予定追加
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* カレンダーコントロール */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold text-gray-800 min-w-[120px] text-center">
                {year}年{monthNames[month]}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              {(['month', 'week', 'day'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewType === type
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {type === 'month' ? '月' : type === 'week' ? '週' : '日'}
                </button>
              ))}
            </div>
          </div>

          {/* イベントタイプフィルター */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuestEvents(!showQuestEvents)}
                className="flex items-center gap-2 text-sm"
              >
                {showQuestEvents ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>クエスト</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPersonalEvents(!showPersonalEvents)}
                className="flex items-center gap-2 text-sm"
              >
                {showPersonalEvents ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>個人予定</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* カレンダー */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className={`p-4 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 ${
                        index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* カレンダーグリッド */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getDayEvents(day.date);
                    const isCurrentMonth = day.isCurrentMonth;
                    const todayClass = isToday(day.date);

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                        } ${todayClass ? 'bg-blue-50 border-blue-200' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          todayClass ? 'text-blue-600' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity`}
                              title={event.title}
                            >
                              <div className="flex items-center gap-1">
                                {getEventTypeIcon(event.type)}
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 pl-1">
                              +{dayEvents.length - 3}件
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドパネル */}
          <div className="space-y-6">
            {/* 今日の予定 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  今日の予定
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('ja-JP', { 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getDayEvents(new Date()).length > 0 ? (
                  <div className="space-y-3">
                    {getDayEvents(new Date()).map((event) => (
                      <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 ${event.color} rounded-full mt-1`}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {event.date.toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                {event.endDate && ` - ${event.endDate.toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}`}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.type === 'quest' && event.participants && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Users className="h-3 w-3" />
                                <span>{event.participants}/{event.maxParticipants}人参加</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">今日の予定はありません</p>
                )}
              </CardContent>
            </Card>

            {/* 今週の予定概要 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  今週の予定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleEvents
                    .filter(event => {
                      const eventWeek = getWeekNumber(event.date);
                      const currentWeek = getWeekNumber(new Date());
                      return eventWeek === currentWeek;
                    })
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <div className={`w-2 h-2 ${event.color} rounded-full`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {event.date.toLocaleDateString('ja-JP', { 
                              month: 'short', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* クイックアクション */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">クイックアクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/quests">
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      クエストを探す
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    個人予定を追加
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    カレンダーを同期
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// 週番号を取得する関数
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
