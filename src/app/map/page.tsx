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
          <div className="relative bg-white rounded-lg min-h-[600px] overflow-hidden border border-gray-300 shadow-lg">
            {/* 高品質地図背景 */}
            <div className="absolute inset-0">
              {/* 地形の詳細レイヤー */}
              <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* 地面の基本色 */}
                <rect width="800" height="600" fill="#f0f9e8"/>
                
                {/* 山岳地帯 */}
                <polygon points="0,400 150,200 300,250 450,150 600,200 800,180 800,600 0,600" fill="#d4e6b7" />
                <polygon points="100,500 250,300 400,350 550,250 700,300 800,280 800,600 100,600" fill="#c9e0a8" />
                <polygon points="200,600 350,400 500,450 650,350 800,380 800,600 200,600" fill="#bdd999" />
                
                {/* 森林エリア */}
                {Array.from({ length: 120 }, (_, i) => {
                  const x = (i % 40) * 20 + Math.random() * 15;
                  const y = 200 + Math.floor(i / 40) * 60 + Math.random() * 40;
                  const size = 4 + Math.random() * 6;
                  return (
                    <circle key={`tree-${i}`} cx={x} cy={y} r={size} fill="#228b22" opacity="0.8"/>
                  );
                })}
                
                {/* 川・水系 */}
                <path d="M0,350 Q200,340 400,360 T800,340" stroke="#4a90e2" strokeWidth="12" fill="none" opacity="0.8"/>
                <path d="M200,500 Q400,490 600,500" stroke="#4a90e2" strokeWidth="8" fill="none" opacity="0.6"/>
                
                {/* 主要道路 */}
                <path d="M0,450 Q200,440 400,450 T800,430" stroke="#666" strokeWidth="8" fill="none"/>
                <path d="M300,0 Q320,200 340,400 T360,600" stroke="#666" strokeWidth="6" fill="none"/>
                <path d="M500,0 Q520,200 540,400 T560,600" stroke="#666" strokeWidth="6" fill="none"/>
                
                {/* 道路の中央線 */}
                <path d="M0,450 Q200,440 400,450 T800,430" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="10,5"/>
                <path d="M300,0 Q320,200 340,400 T360,600" stroke="#fff" strokeWidth="1" fill="none" strokeDasharray="8,4"/>
                <path d="M500,0 Q520,200 540,400 T560,600" stroke="#fff" strokeWidth="1" fill="none" strokeDasharray="8,4"/>
                
                {/* 建物群 */}
                {/* 白峰研修センター */}
                <rect x="150" y="280" width="80" height="60" fill="#dc3545" stroke="#000" strokeWidth="1"/>
                <rect x="160" y="270" width="60" height="10" fill="#8b0000"/>
                <rect x="170" y="290" width="15" height="20" fill="#654321"/>
                <rect x="200" y="290" width="15" height="15" fill="#87ceeb"/>
                <rect x="220" y="295" width="8" height="10" fill="#87ceeb"/>
                
                {/* 食堂 */}
                <rect x="480" y="200" width="60" height="50" fill="#007bff" stroke="#000" strokeWidth="1"/>
                <rect x="490" y="190" width="40" height="10" fill="#000080"/>
                <rect x="500" y="210" width="12" height="15" fill="#654321"/>
                <rect x="520" y="210" width="10" height="10" fill="#87ceeb"/>
                
                {/* 図書館 */}
                <rect x="250" y="380" width="70" height="55" fill="#28a745" stroke="#000" strokeWidth="1"/>
                <rect x="260" y="370" width="50" height="10" fill="#006400"/>
                <rect x="270" y="395" width="12" height="18" fill="#654321"/>
                <rect x="295" y="395" width="8" height="8" fill="#87ceeb"/>
                <rect x="310" y="395" width="8" height="8" fill="#87ceeb"/>
                
                {/* 体育館 */}
                <rect x="580" y="320" width="90" height="70" fill="#ffc107" stroke="#000" strokeWidth="1"/>
                <rect x="590" y="310" width="70" height="10" fill="#ff8c00"/>
                <rect x="600" y="340" width="15" height="25" fill="#654321"/>
                <rect x="630" y="340" width="12" height="15" fill="#87ceeb"/>
                <rect x="650" y="340" width="12" height="15" fill="#87ceeb"/>
                
                {/* 宿舎群 */}
                {Array.from({ length: 8 }, (_, i) => {
                  const x = 100 + (i % 4) * 70;
                  const y = 500 + Math.floor(i / 4) * 40;
                  return (
                    <g key={`dorm-${i}`}>
                      <rect x={x} y={y} width="40" height="30" fill="#9370db" stroke="#000" strokeWidth="1"/>
                      <rect x={x + 5} y={y - 8} width="30" height="8" fill="#4b0082"/>
                      <rect x={x + 15} y={y + 8} width="8" height="12" fill="#654321"/>
                      <rect x={x + 28} y={y + 8} width="6" height="6" fill="#87ceeb"/>
                    </g>
                  );
                })}
                
                {/* グリッド（座標系） */}
                {Array.from({ length: 17 }, (_, i) => (
                  <g key={`grid-${i}`} opacity="0.1">
                    <line x1={i * 50} y1="0" x2={i * 50} y2="600" stroke="#000" strokeWidth="0.5"/>
                    <line x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#000" strokeWidth="0.5"/>
                  </g>
                ))}
                
                {/* 等高線 */}
                <path d="M50,300 Q200,290 350,300 T650,290" stroke="#8b4513" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M80,250 Q230,240 380,250 T680,240" stroke="#8b4513" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M120,200 Q270,190 420,200 T720,190" stroke="#8b4513" strokeWidth="1" fill="none" opacity="0.3"/>
              </svg>
              
              {/* 自分の位置マーカー */}
              {userLocation && (
                <div 
                  className="absolute w-10 h-10 z-30"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium shadow-lg">
                      📍 あなたの位置
                    </div>
                    {/* GPS精度の円 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-blue-400 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>
              )}
              
              {/* 他のユーザー */}
              <div className="absolute top-1/4 right-1/2 w-8 h-8 bg-purple-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center z-20">
                <span className="text-white text-xs font-bold">田</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full shadow">
                  田中
                </div>
              </div>
              <div className="absolute bottom-1/4 left-2/3 w-8 h-8 bg-orange-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center z-20">
                <span className="text-white text-xs font-bold">佐</span>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full shadow">
                  佐藤
                </div>
              </div>
            </div>
            
            {/* 地図コントロール */}
            <div className="absolute top-4 right-4 space-y-2 z-40">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border"
                onClick={() => {
                  console.log('現在位置に移動');
                  alert('現在位置へ移動機能（実装予定）');
                }}
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border"
                onClick={() => alert('ズーム機能（実装予定）')}
              >
                +
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border"
                onClick={() => alert('ズームアウト機能（実装予定）')}
              >
                -
              </Button>
            </div>
            
            {/* 地図の凡例 */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 text-xs z-40 shadow-xl border space-y-2">
              <p className="font-bold mb-3 text-gray-800">🗺️ 地図凡例</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full shadow"></div>
                  <span className="text-gray-700">あなたの位置</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded shadow"></div>
                  <span className="text-gray-700">研修センター</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded shadow"></div>
                  <span className="text-gray-700">食堂</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded shadow"></div>
                  <span className="text-gray-700">図書館</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded shadow"></div>
                  <span className="text-gray-700">体育館</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded shadow"></div>
                  <span className="text-gray-700">宿舎</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-2 bg-gray-600 rounded shadow"></div>
                  <span className="text-gray-700">道路</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-2 bg-blue-400 rounded shadow"></div>
                  <span className="text-gray-700">川</span>
                </div>
              </div>
            </div>
            
            {/* 位置情報パネル */}
            {userLocation && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 text-sm z-40 shadow-xl border">
                <p className="font-bold text-gray-800 mb-2">📍 位置情報</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>緯度: {userLocation[0].toFixed(6)}</p>
                  <p>経度: {userLocation[1].toFixed(6)}</p>
                  <p className={`font-medium ${locationPermission === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
                    {locationPermission === 'granted' ? '✅ GPS有効' : '❌ GPS無効'}
                  </p>
                  <p className="text-gray-500">精度: ±10m</p>
                </div>
              </div>
            )}
            
            {/* スケール表示 */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-xs z-40 shadow-xl border">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-black"></div>
                <span className="text-gray-700">100m</span>
              </div>
            </div>
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
