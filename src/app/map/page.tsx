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
  WifiOff
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import dynamic from 'next/dynamic';
import AvatarMovementRealtime from '@/components/avatar/AvatarMovementRealtime';

// Leafletアイコンの修正
import L from 'leaflet';

// デフォルトアイコンの修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Leafletを動的インポート（SSR回避）
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// 白峰エリアの座標（石川県白山市白峰）
const HAKUMINE_CENTER = [36.2547, 136.6342];

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
    
    // 位置情報の取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationPermission('granted');
          setIsLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationPermission('denied');
          setUserLocation(HAKUMINE_CENTER as [number, number]);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分
        }
      );
    } else {
      setLocationPermission('denied');
      setUserLocation(HAKUMINE_CENTER as [number, number]);
      setIsLoading(false);
    }
  }, []);

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    // ここで実際の位置情報共有設定を更新
  };

  const requestLocationPermission = () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Location permission denied:', error);
          setLocationPermission('denied');
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">位置情報を取得中...</p>
        </div>
      </div>
    );
  }

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
              <MapPin className="h-6 w-6 text-red-600" />
              <h1 className="text-lg font-bold text-gray-800">白峰マップ</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={locationSharing ? 'default' : 'outline'}
              size="sm"
              onClick={toggleLocationSharing}
              disabled={locationPermission !== 'granted'}
            >
              {locationSharing ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {locationSharing ? '共有中' : '非共有'}
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* サイドパネル */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* 位置情報設定 */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {locationPermission === 'granted' ? (
                    <Wifi className="h-5 w-5 text-green-600" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-600" />
                  )}
                  位置情報設定
                </CardTitle>
              </CardHeader>
              <CardContent>
                {locationPermission === 'denied' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      位置情報へのアクセスが拒否されています。
                    </p>
                    <Button size="sm" onClick={requestLocationPermission}>
                      位置情報を許可
                    </Button>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">位置情報共有</span>
                    <Button
                      variant={locationSharing ? 'destructive' : 'default'}
                      size="sm"
                      onClick={toggleLocationSharing}
                      disabled={locationPermission !== 'granted'}
                    >
                      {locationSharing ? 'OFF' : 'ON'}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {locationSharing 
                      ? '他の学生があなたの位置を確認できます'
                      : '位置情報は他の学生に表示されません'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* オンラインユーザー一覧 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  近くの仲間
                </CardTitle>
                <CardDescription>
                  白峰エリアで活動中: {onlineUsers.length}人
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {onlineUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${u.status === 'online' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-400 text-white'
                        }
                      `}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.activity}</p>
                      </div>
                      <div className={`
                        w-2 h-2 rounded-full
                        ${u.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}
                      `} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* マップエリア */}
        <div className="flex-1 relative">          
          {userLocation && (
            <MapContainer
              center={userLocation}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* 現在のユーザーのマーカー */}
              {locationSharing && userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">あなたの位置</div>
                      <div className="text-sm text-gray-600">{user?.displayName}</div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}

          {/* インタラクティブなアバター移動エリア（地図上のオーバーレイ） */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto bg-transparent">
              <AvatarMovementRealtime />
            </div>
            
            {/* 操作説明 */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600">
              <p className="font-medium mb-1">アバター操作:</p>
              <p>矢印キー または WASD で移動</p>
            </div>
          </div>
          
          {/* マップが読み込めない場合のフォールバック */}
          {!userLocation && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">位置情報を取得できませんでした</p>
                <p className="text-sm text-gray-500 mb-4">位置情報を許可してください</p>
                <Button className="mt-4" onClick={requestLocationPermission}>
                  位置情報を許可する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
