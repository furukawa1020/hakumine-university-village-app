'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  MoreVertical,
  Hash,
  Volume2,
  VolumeX,
  Plus,
  Search,
  Smile,
  Image,
  Paperclip,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

// サンプルチャットルーム
const sampleRooms = [
  { 
    id: 'general', 
    name: '全体チャット', 
    type: 'general',
    icon: Hash,
    unreadCount: 3,
    lastMessage: '明日の雪かきクエスト、参加します！',
    lastMessageTime: new Date('2025-01-14T15:30:00')
  },
  { 
    id: 'snow-removal', 
    name: '雪かきクエスト', 
    type: 'quest',
    icon: Hash,
    unreadCount: 1,
    lastMessage: '集合場所は白峰コミュニティセンターです',
    lastMessageTime: new Date('2025-01-14T14:20:00')
  },
  { 
    id: 'wood-splitting', 
    name: '薪割り体験', 
    type: 'quest',
    icon: Hash,
    unreadCount: 0,
    lastMessage: '次回は来週開催予定です',
    lastMessageTime: new Date('2025-01-13T16:45:00')
  },
  { 
    id: 'random', 
    name: '雑談', 
    type: 'general',
    icon: Hash,
    unreadCount: 7,
    lastMessage: '白峰の温泉、とても良かったです♨️',
    lastMessageTime: new Date('2025-01-14T12:15:00')
  }
];

// サンプルメッセージ
const sampleMessages = [
  {
    id: '1',
    userId: 'user1',
    userName: '田中さん',
    content: 'おはようございます！今日も一日よろしくお願いします。',
    timestamp: new Date('2025-01-14T09:00:00'),
    type: 'text'
  },
  {
    id: '2',
    userId: 'user2', 
    userName: '佐藤さん',
    content: 'おはようございます！今日の雪かきクエスト、楽しみですね。',
    timestamp: new Date('2025-01-14T09:05:00'),
    type: 'text'
  },
  {
    id: '3',
    userId: 'current',
    userName: 'あなた',
    content: 'はい！みんなで頑張りましょう💪',
    timestamp: new Date('2025-01-14T09:10:00'),
    type: 'text'
  },
  {
    id: '4',
    userId: 'user3',
    userName: '山田さん',
    content: '音声メッセージを送信しました',
    timestamp: new Date('2025-01-14T09:15:00'),
    type: 'voice',
    duration: 12
  },
  {
    id: '5',
    userId: 'user1',
    userName: '田中さん',
    content: '集合時間は9時30分でしたよね？',
    timestamp: new Date('2025-01-14T09:20:00'),
    type: 'text'
  }
];

export default function ChatPage() {
  const { user } = useAuthStore();
  const [selectedRoom, setSelectedRoom] = useState(sampleRooms[0]);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);

  // スタンプデータ
  const stickers = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
    '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',
    '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝',
    '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁',
    '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩',
    '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴',
    '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇',
    '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈',
    '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
    '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '🔥', '⭐', '🌟', '✨', '💫', '💯', '💢', '💨', '💦', '💤'
  ];

  const sendSticker = (sticker: string) => {
    if (!user || !selectedRoom) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || 'Unknown User',
      content: sticker,
      timestamp: new Date(),
      type: 'sticker'
    };

    setMessages(prev => [...prev, newMessage]);
    setShowStickers(false);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ゲストユーザーチェック
  if (user?.isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ダッシュボード
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-yellow-600" />
              <h1 className="text-lg font-bold text-gray-800">チャット</h1>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  チャット機能は会員限定です
                </h2>
                <p className="text-gray-600 mb-6">
                  ゲストモードではチャット機能をご利用いただけません。
                  アカウント登録を行うと、他の参加者とリアルタイムでチャットできます。
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/register" className="block">
                  <Button className="w-full">
                    アカウント登録してチャットを利用
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    ダッシュボードに戻る
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💬 チャット機能でできること</h3>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• リアルタイムメッセージ交換</li>
                  <li>• 絵文字や画像の送信</li>
                  <li>• 音声通話・ビデオ通話</li>
                  <li>• クエスト専用チャンネル</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 絵文字リスト
  const emojis = [
    '😊', '😂', '🤣', '😍', '🥰', '😘', '😋', '😎', '🤔', '😅',
    '😭', '😢', '😤', '😡', '🥺', '😴', '🤯', '🤪', '😜', '😉',
    '👍', '👎', '👌', '✌️', '🤝', '👏', '🙏', '💪', '🔥', '⭐',
    '❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💖',
    '🎉', '🎊', '🎈', '🎁', '🏆', '🌟', '✨', '💫', '🌈', '☀️'
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB制限
        alert('ファイルサイズは5MB以下にしてください');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return;

    let messageContent = newMessage;
    let messageType: 'text' | 'image' = 'text';

    // 画像付きメッセージの場合
    if (selectedImage) {
      messageType = 'image';
      // 実際の実装では画像をFirebase Storageにアップロード
      messageContent = imagePreview || '画像を送信しました';
    }

    const message = {
      id: Date.now().toString(),
      userId: 'current',
      userName: user?.displayName || 'あなた',
      content: messageContent,
      timestamp: new Date(),
      type: messageType,
      imageUrl: selectedImage ? imagePreview : undefined
    };

    setMessages([...messages, message]);
    setNewMessage('');
    removeImage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // 録音開始の処理
      console.log('Recording started');
    } else {
      // 録音終了の処理
      console.log('Recording stopped');
      const voiceMessage = {
        id: Date.now().toString(),
        userId: 'current',
        userName: user?.displayName || 'あなた',
        content: '音声メッセージを送信しました',
        timestamp: new Date(),
        type: 'voice' as const,
        duration: 5
      };
      setMessages([...messages, voiceMessage]);
    }
  };

  const toggleCall = () => {
    setIsInCall(!isInCall);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const VoiceMessage = ({ duration }: { duration: number }) => (
    <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-lg max-w-xs">
      <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
        <Volume2 className="h-4 w-4" />
      </Button>
      <div className="flex-1 h-1 bg-blue-300 rounded">
        <div className="h-full bg-blue-600 rounded w-1/3"></div>
      </div>
      <span className="text-xs text-gray-600">{duration}s</span>
    </div>
  );

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
              <MessageCircle className="h-6 w-6 text-yellow-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">{selectedRoom.name}</h1>
                <p className="text-xs text-gray-500">5人がオンライン</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isInCall ? 'destructive' : 'outline'}
              size="sm"
              onClick={toggleCall}
            >
              {isInCall ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
            </Button>
            {isInCall && (
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Button size="sm" variant="ghost">
              <Users className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* サイドバー（チャットルーム一覧） */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">チャンネル</h2>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="チャンネルを検索..."
                className="pl-10"
              />
            </div>

            <div className="space-y-1">
              {sampleRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                    selectedRoom.id === room.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <room.icon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{room.name}</p>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{room.lastMessage}</p>
                    <p className="text-xs text-gray-400">{formatTime(room.lastMessageTime)}</p>
                  </div>
                </button>
              ))}
            </div>

            {isInCall && (
              <Card className="mt-4 bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    通話中
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-700">
                    {selectedRoom.name}で通話中
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={toggleCall}>
                      <PhoneOff className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* メインチャット */}
        <div className="flex-1 flex flex-col">
          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === 'current' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${
                  message.userId === 'current' ? 'order-2' : 'order-1'
                }`}>
                  {message.userId !== 'current' && (
                    <p className="text-xs text-gray-500 mb-1 px-2">{message.userName}</p>
                  )}
                  <div className={`p-3 rounded-lg ${
                    message.userId === 'current'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}>
                    {message.type === 'text' ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <VoiceMessage duration={message.duration || 0} />
                    )}
                    <p className={`text-xs mt-1 ${
                      message.userId === 'current' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* メッセージ入力エリア */}
          <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
            {/* 画像プレビュー */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-xs max-h-40 rounded-lg border"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    {/* 絵文字ピッカー */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                        <div className="grid grid-cols-8 gap-1 max-w-xs">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => addEmoji(emoji)}
                              className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowStickers(!showStickers)}
                    >
                      <span className="text-lg">🏷️</span>
                    </Button>
                    
                    {/* スタンプピッカー */}
                    {showStickers && (
                      <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                        <div className="text-xs text-gray-500 mb-2">スタンプを選択</div>
                        <div className="grid grid-cols-10 gap-1 max-w-sm max-h-40 overflow-y-auto">
                          {stickers.map((sticker, index) => (
                            <button
                              key={index}
                              onClick={() => sendSticker(sticker)}
                              className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
                            >
                              {sticker}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                <div className="relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`${selectedRoom.name}にメッセージを送信...`}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedImage}
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="sm"
                onClick={toggleRecording}
                className="h-10 w-10 p-0"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            {isRecording && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-700">録音中...</span>
                  <Button size="sm" variant="ghost" onClick={toggleRecording}>
                    停止
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
