'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Users, 
  Eye, 
  EyeOff, 
  Settings,
  ArrowLeft,
  Navigation,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import SimpleAvatarMovement from '@/components/avatar/SimpleAvatarMovement';

// 白峰エリアの座標（石川県白山市白峰）
const HAKUMINE_CENTER = [36.2547, 136.6342];

// 位置情報追跡
let watchId: number | null = null;

const startLocationTracking = () => {
  if (typeof window === 'undefined' || !navigator.geolocation) return;

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000 // 1分
  };

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('位置情報更新:', { latitude, longitude, accuracy: position.coords.accuracy });
    },
    (error) => {
      console.error('位置情報追跡エラー:', error);
    },
    options
  );

  return () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };
};

export default function MapPage() {
  const { user } = useAuthStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [onlineUsers] = useState<any[]>([]); // 実際のユーザーデータは今後Firebase等から取得
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ブラウザ環境でのみ位置情報を取得
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    // 位置情報の取得（強化版）
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000, // 15秒のタイムアウト
          maximumAge: 300000 // 5分のキャッシュ
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('位置情報取得成功:', { latitude, longitude });
            setUserLocation([latitude, longitude]);
            setLocationPermission('granted');
            setIsLoading(false);
          },
          (error) => {
            console.error('位置情報取得エラー:', error);
            console.log('白峰地域のデフォルト位置を使用します');
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER as [number, number]);
            setIsLoading(false);
          },
          options
        );
      } else {
        console.log('Geolocation APIが利用できません');
        setLocationPermission('denied');
        setUserLocation(HAKUMINE_CENTER as [number, number]);
        setIsLoading(false);
      }
    };

    // 位置情報許可状態をチェック
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('位置情報許可状態:', result.state);
        if (result.state === 'granted') {
          getCurrentLocation();
        } else if (result.state === 'denied') {
          setLocationPermission('denied');
          setUserLocation(HAKUMINE_CENTER as [number, number]);
          setIsLoading(false);
        } else {
          getCurrentLocation();
        }
      }).catch(() => {
        // permissions API が利用できない場合は直接取得を試行
        getCurrentLocation();
      });
    } else {
      getCurrentLocation();
    }
  }, []);

  const toggleLocationSharing = () => {
    const newSharingState = !locationSharing;
    setLocationSharing(newSharingState);
    
    if (newSharingState && locationPermission === 'granted') {
      // 位置情報共有を有効にした場合、リアルタイム追跡を開始
      startLocationTracking();
      console.log('位置情報共有を有効にしました');
    } else {
      console.log('位置情報共有を無効にしました');
    }
    
    // ここで実際の位置情報共有設定をFirebaseに保存する処理を追加予定
  };

  // 位置情報が取得できた場合の自動追跡開始
  useEffect(() => {
    if (locationPermission === 'granted' && locationSharing) {
      const cleanup = startLocationTracking();
      return cleanup;
    }
  }, [locationPermission, locationSharing]);

  const requestLocationPermission = () => {
    if (typeof window === 'undefined') return;
    
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setLocationPermission('granted');
            console.log('位置情報許可が得られました:', { latitude, longitude });
          },
          (error) => {
            console.error('位置情報取得失敗:', error);
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER as [number, number]);
          },
          options
        );
      }
    };

    getCurrentLocation();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">位置情報を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">白峰村マップ</h1>
        </div>
        <Link href="/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </Link>
      </div>

      {/* 位置情報ステータス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>位置情報</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {locationPermission === 'granted' ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {locationPermission === 'granted' ? '位置情報取得中' : '位置情報が利用できません'}
              </span>
            </div>
            {locationPermission === 'denied' && (
              <Button onClick={requestLocationPermission} size="sm">
                許可を求める
              </Button>
            )}
          </div>
          
          {userLocation && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">現在位置</p>
              <p className="text-xs text-gray-600">
                緯度: {userLocation[0].toFixed(6)}<br />
                経度: {userLocation[1].toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm">位置情報を他の人と共有</span>
            <Button
              onClick={toggleLocationSharing}
              variant={locationSharing ? "default" : "outline"}
              size="sm"
              disabled={locationPermission !== 'granted'}
            >
              {locationSharing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  共有中
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  非共有
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* マップ表示エリア */}
      <Card>
        <CardHeader>
          <CardTitle>村の地図</CardTitle>
          <CardDescription>
            白峰大学村の地図です。あなたの位置と他の学生の位置が表示されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-green-100 via-blue-50 to-purple-50 rounded-lg min-h-[500px] overflow-hidden border-2 border-gray-200">
            {/* 地図背景 */}
            <div className="absolute inset-0">
              {/* 山の背景 */}
              <div className="absolute bottom-0 left-0 w-full h-2/3">
                <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
                  <polygon points="0,200 100,50 200,80 300,30 400,60 400,200" fill="#10b981" />
                  <polygon points="0,200 80,100 160,120 240,80 320,100 400,90 400,200" fill="#059669" />
                  <polygon points="50,200 150,70 250,90 350,40 400,50 400,200" fill="#065f46" />
                </svg>
              </div>
              
              {/* 道路パス */}
              <svg className="absolute inset-0 w-full h-full opacity-40">
                <path d="M0,150 Q100,130 200,140 T400,120" stroke="#6b7280" strokeWidth="8" fill="none" strokeDasharray="20,10"/>
                <path d="M50,200 Q150,180 250,190 T400,170" stroke="#6b7280" strokeWidth="6" fill="none" strokeDasharray="15,8"/>
              </svg>
              
              {/* 建物・施設のマーカー */}
              <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-500 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">研</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-1 rounded whitespace-nowrap">
                  白峰研修センター
                </div>
              </div>
              <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">食</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap">
                  食堂
                </div>
              </div>
              <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-green-500 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">図</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap">
                  図書館
                </div>
              </div>
              <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-yellow-500 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">体</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-500 text-white px-2 py-1 rounded whitespace-nowrap">
                  体育館
                </div>
              </div>
              
              {/* 自然要素 */}
              <div className="absolute top-1/6 left-1/6 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
              <div className="absolute top-1/5 left-1/5 w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
              <div className="absolute top-1/8 left-1/8 w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
              
              {/* グリッドライン */}
              <svg className="absolute inset-0 w-full h-full opacity-15">
                {Array.from({ length: 21 }, (_, i) => (
                  <g key={i}>
                    <line x1={`${i * 5}%`} y1="0%" x2={`${i * 5}%`} y2="100%" stroke="#64748b" strokeWidth="1" />
                    <line x1="0%" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#64748b" strokeWidth="1" />
                  </g>
                ))}
              </svg>
              
              {/* 自分の位置マーカー */}
              {userLocation && (
                <div 
                  className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg z-20 flex items-center justify-center"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-medium">
                    📍 あなたの位置
                  </div>
                </div>
              )}
              
              {/* 他のユーザーのサンプル */}
              <div className="absolute top-1/4 right-1/2 w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">田</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-purple-500 text-white px-1 py-0.5 rounded">
                  田中
                </div>
              </div>
              <div className="absolute bottom-1/4 left-2/3 w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">佐</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-1 py-0.5 rounded">
                  佐藤
                </div>
              </div>
            </div>
            
            {/* 地図コントロール */}
            <div className="absolute top-4 right-4 space-y-2 z-30">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg"
                onClick={() => {
                  console.log('自分の位置に移動');
                  alert('現在位置へ移動機能（実装予定）');
                }}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 地図の凡例 */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs z-30 space-y-1">
              <p className="font-medium mb-2">🗺️ 地図凡例</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>あなたの位置</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>施設・建物</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>他の学生</span>
              </div>
            </div>
            
            {/* 現在位置情報 */}
            {userLocation && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm z-30">
                <p className="font-medium text-gray-700 mb-1">📍 位置情報</p>
                <p className="text-xs text-gray-600">
                  緯度: {userLocation[0].toFixed(6)}<br />
                  経度: {userLocation[1].toFixed(6)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {locationPermission === 'granted' ? '✅ GPS有効' : '❌ GPS無効'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* オンラインユーザー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>オンラインの学生</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {onlineUsers.length > 0 ? (
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">白峰村内</p>
                  </div>
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">現在オンラインの学生はいません</p>
              <p className="text-xs text-gray-400">
                {user ? `${user.displayName || 'あなた'}がオンラインです` : 'ログインしてオンライン状態を表示'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* アバター移動機能 */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>アバター操作</CardTitle>
            <CardDescription>
              キーボードでアバターを操作してみましょう（WASD または 矢印キー）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <SimpleAvatarMovement />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
