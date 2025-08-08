'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  MapPin,
  BookOpen,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { XNavigation } from '@/components/navigation/XNavigation';
import { useAuthStore } from '@/stores/authStore';
import { useCalendarStore } from '@/stores/calendarStore';

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarPageClient() {
  const { user } = useAuthStore();
  const {
    events,
    stayEvents,
    loading,
    fetchEvents,
    fetchStayEvents,
    createEvent,
    createStayEvent
  } = useCalendarStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventType, setEventType] = useState<'personal' | 'stay'>('personal');
  const [mounted, setMounted] = useState(false);
  
  // フォーム状態
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState('');
  const [newEventEndDate, setNewEventEndDate] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      fetchEvents(startOfMonth, endOfMonth);
      fetchStayEvents(startOfMonth, endOfMonth);
    }
  }, [mounted, fetchEvents, fetchStayEvents]);

  // SSR中は何もレンダリングしない
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">カレンダーを読み込み中...</p>
        </div>
      </div>
    );
  }

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

    // 次月の日付を追加（6週間表示にするため）
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  // 指定された日付のイベントを取得
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  // 指定された日付の滞在イベントを取得
  const getStayEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return stayEvents.filter(stay => {
      const startDate = new Date(stay.startDate).toISOString().split('T')[0];
      const endDate = new Date(stay.endDate).toISOString().split('T')[0];
      return dateString >= startDate && dateString <= endDate;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowCreateModal(true);
    
    // 選択された日付を初期値に設定
    const dateString = date.toISOString().split('T')[0];
    setNewEventStartDate(dateString + 'T09:00');
    setNewEventEndDate(dateString + 'T10:00');
  };

  const handleCreateEvent = async () => {
    if (!user || !newEventStartDate || !newEventEndDate) return;
    if (eventType === 'personal' && !newEventTitle.trim()) return;

    try {
      if (eventType === 'personal') {
        await createEvent({
          title: newEventTitle,
          description: newEventDescription,
          location: newEventLocation,
          startDate: new Date(newEventStartDate),
          endDate: new Date(newEventEndDate),
          allDay: false,
          type: 'personal',
          color: '#3B82F6',
          isPublic: true
        });
      } else if (eventType === 'stay') {
        await createStayEvent({
          startDate: new Date(newEventStartDate),
          endDate: new Date(newEventEndDate),
          location: newEventLocation || '白峰地区',
          purpose: newEventDescription || '白峰滞在',
          isPublic: true
        });
      }

      // フォームをリセット
      setShowCreateModal(false);
      setNewEventTitle('');
      setNewEventDescription('');
      setNewEventLocation('');
      setNewEventStartDate('');
      setNewEventEndDate('');
      setSelectedDate(null);

      // イベントを再取得
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      fetchEvents(startOfMonth, endOfMonth);
      fetchStayEvents(startOfMonth, endOfMonth);
    } catch (error) {
      console.error('イベントの作成に失敗しました:', error);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventLocation('');
    setNewEventStartDate('');
    setNewEventEndDate('');
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">カレンダーを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">カレンダー</h1>
            </div>
          </div>
        </div>

        {/* カレンダーナビゲーション */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">
                {year}年 {monthNames[month]}
              </CardTitle>
              <Button variant="ghost" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダー本体 */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day.date);
                const dayStayEvents = getStayEventsForDate(day.date);
                const hasEvents = dayEvents.length > 0 || dayStayEvents.length > 0;
                const isToday = day.date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`
                      p-3 text-left border rounded-lg h-24 transition-colors relative
                      ${day.isCurrentMonth 
                        ? 'bg-white hover:bg-gray-50 border-gray-200' 
                        : 'bg-gray-50 text-gray-400 border-gray-100'
                      }
                      ${isToday ? 'ring-2 ring-indigo-500' : ''}
                      ${hasEvents ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="font-medium text-sm">{day.date.getDate()}</div>
                    
                    {/* イベントインジケーター */}
                    <div className="mt-1 space-y-1">
                      {dayStayEvents.map((stay, i) => (
                        <div key={i} className="w-full h-1 bg-purple-400 rounded"></div>
                      ))}
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <div key={i} className="text-xs truncate bg-blue-100 text-blue-800 px-1 rounded">
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2}件</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 今日の予定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              今日の予定
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date();
              const todayEvents = getEventsForDate(today);
              const todayStayEvents = getStayEventsForDate(today);
              
              if (todayEvents.length === 0 && todayStayEvents.length === 0) {
                return <p className="text-gray-600">今日は予定がありません</p>;
              }

              return (
                <div className="space-y-3">
                  {todayStayEvents.map((stay) => (
                    <div key={stay.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">白峰滞在</p>
                        <p className="text-sm text-gray-600">{stay.purpose}</p>
                      </div>
                    </div>
                  ))}
                  
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          {event.description && <p>{event.description}</p>}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.startDate).toLocaleTimeString('ja-JP', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {' - '}
                              {new Date(event.endDate).toLocaleTimeString('ja-JP', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* イベント作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>新しいイベント</CardTitle>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {selectedDate && (
                  <CardDescription>
                    {selectedDate.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* イベントタイプ選択 */}
                <div className="flex gap-2">
                  <Button
                    variant={eventType === 'personal' ? 'default' : 'outline'}
                    onClick={() => setEventType('personal')}
                    className="flex-1"
                  >
                    個人予定
                  </Button>
                  <Button
                    variant={eventType === 'stay' ? 'default' : 'outline'}
                    onClick={() => setEventType('stay')}
                    className="flex-1"
                  >
                    滞在予定
                  </Button>
                </div>

                {eventType === 'personal' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">タイトル</label>
                      <Input
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="イベント名を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">場所</label>
                      <Input
                        value={newEventLocation}
                        onChange={(e) => setNewEventLocation(e.target.value)}
                        placeholder="場所を入力"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {eventType === 'personal' ? '説明' : '滞在目的'}
                  </label>
                  <Textarea
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    placeholder={eventType === 'personal' ? '説明を入力' : '滞在の目的を入力'}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">開始</label>
                    <Input
                      type="datetime-local"
                      value={newEventStartDate}
                      onChange={(e) => setNewEventStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">終了</label>
                    <Input
                      type="datetime-local"
                      value={newEventEndDate}
                      onChange={(e) => setNewEventEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={closeModal} className="flex-1">
                    キャンセル
                  </Button>
                  <Button 
                    onClick={handleCreateEvent} 
                    className="flex-1"
                    disabled={!newEventStartDate || !newEventEndDate || (eventType === 'personal' && !newEventTitle.trim())}
                  >
                    作成
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <XNavigation />
    </div>
  );
}
