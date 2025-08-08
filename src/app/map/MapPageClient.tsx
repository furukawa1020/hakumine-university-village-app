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
import { useLocationStore } from '@/stores/locationStore';
import { MapComponent } from '@/components/map/MapComponent';
import { XNavigation } from '@/components/navigation/XNavigation';

// 白峰エリアの座標（石川県白山市白峰）
const HAKUMINE_CENTER = [36.2547, 136.6342] as [number, number];

export default function MapPageClient() {
  const { user } = useAuthStore();
  const {
    userLocations,
    currentUserLocation,
    locationPermission,
    isSharing,
    loading,
    fetchUserLocations,
    updateUserLocation,
    toggleLocationSharing,
    setCurrentUserLocation,
    setLocationPermission,
    subscribeToLocationUpdates
  } = useLocationStore();
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初期データ取得
    fetchUserLocations();
    
    // リアルタイム更新を開始
    const unsubscribe = subscribeToLocationUpdates();
    
    return unsubscribe;
  }, [fetchUserLocations, subscribeToLocationUpdates]);

  // 位置情報取得
  useEffect(() => {
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log('位置情報取得成功:', { latitude, longitude, accuracy });
            setCurrentUserLocation([latitude, longitude]);
            setGpsAccuracy(accuracy);
            setLocationPermission('granted');
            setIsLoading(false);
            
            // 位置情報共有が有効な場合、Firestoreに保存
            if (isSharing) {
              updateUserLocation(latitude, longitude, accuracy);
            }
          },
          (error) => {
            console.error('位置情報取得エラー:', error);
            setLocationPermission('denied');
            setIsLoading(false);
            
            // エラーの場合は白峰の中心座標をデフォルト位置として設定
            setCurrentUserLocation(HAKUMINE_CENTER);
          },
          options
        );
      } else {
        console.error('位置情報がサポートされていません');
        setLocationPermission('denied');
        setIsLoading(false);
        setCurrentUserLocation(HAKUMINE_CENTER);
      }
    };

    getCurrentLocation();
  }, [isSharing, setCurrentUserLocation, setLocationPermission, updateUserLocation]);

  // 位置情報の定期更新（位置情報共有が有効な場合）
  useEffect(() => {
    if (!isSharing || locationPermission !== 'granted') return;

    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentUserLocation([latitude, longitude]);
        setGpsAccuracy(accuracy);
        updateUserLocation(latitude, longitude, accuracy);
      },
      (error) => {
        console.error('位置情報監視エラー:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isSharing, locationPermission, setCurrentUserLocation, updateUserLocation]);

  const handleToggleLocationSharing = async () => {
    if (locationPermission === 'denied') {
      alert('位置情報の使用が拒否されています。ブラウザの設定を確認してください。');
      return;
    }
    
    await toggleLocationSharing();
  };

  const getConnectionStatus = () => {
    if (loading) return 'loading';
    if (locationPermission === 'denied') return 'denied';
    if (locationPermission === 'granted' && currentUserLocation) return 'connected';
    return 'pending';
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <XNavigation />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">マップ</h1>
                <p className="text-sm text-gray-600">村の仲間の位置を確認</p>
              </div>
            </div>
          </div>
          
          {/* 接続状態インジケーター */}
          <div className="flex items-center space-x-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : connectionStatus === 'loading' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm text-gray-600">
              {connectionStatus === 'connected' && 'GPS接続済み'}
              {connectionStatus === 'loading' && '位置情報取得中...'}
              {connectionStatus === 'denied' && 'GPS無効'}
              {connectionStatus === 'pending' && '接続待機中'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* マップ */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden">
                  <MapComponent
                    center={currentUserLocation || HAKUMINE_CENTER}
                    userLocations={userLocations}
                    currentUserLocation={currentUserLocation}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* サイドバー */}
          <div className="space-y-6">
            {/* 位置情報設定 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>位置情報</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">位置情報共有</span>
                  <Button
                    size="sm"
                    variant={isSharing ? "default" : "outline"}
                    onClick={handleToggleLocationSharing}
                    disabled={loading}
                  >
                    {isSharing ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                    {isSharing ? 'ON' : 'OFF'}
                  </Button>
                </div>
                
                {currentUserLocation && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>緯度: {currentUserLocation[0].toFixed(6)}</p>
                    <p>経度: {currentUserLocation[1].toFixed(6)}</p>
                    {gpsAccuracy && <p>精度: ±{Math.round(gpsAccuracy)}m</p>}
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  {isSharing
                    ? '他の参加者があなたの位置を見ることができます'
                    : '位置情報は共有されていません'
                  }
                </div>
              </CardContent>
            </Card>
            
            {/* オンラインユーザー */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>オンライン参加者</span>
                  <span className="text-sm font-normal text-gray-600">({userLocations.length}人)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userLocations.length === 0 ? (
                    <p className="text-gray-600 text-sm text-center">
                      位置情報を共有している参加者はいません
                    </p>
                  ) : (
                    userLocations.map((userLocation) => (
                      <div key={userLocation.id} className="flex items-center space-x-3">
                        {/* アバター表示エリア */}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {userLocation.userName.charAt(0)}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium">{userLocation.userName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(userLocation.lastUpdated).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} 更新
                          </p>
                        </div>
                        
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* プライバシー設定 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>プライバシー</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 位置情報は白峰地区内のみ表示されます</p>
                  <p>• 共有を停止するといつでも非表示にできます</p>
                  <p>• 詳細な住所情報は表示されません</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
