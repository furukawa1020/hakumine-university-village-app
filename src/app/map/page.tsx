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
import { MapComponent } from '@/components/map/MapComponent';
import { XNavigation } from '@/components/navigation/XNavigation';

// 白峰エリアの座標（石川県白山市白峰）
const HAKUMINE_CENTER = [36.2547, 136.6342] as [number, number];

export default function MapPage() {
  const { user } = useAuthStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // オンラインユーザー（アバター情報を含むサンプルデータ）
  const [onlineUsers] = useState([
    { 
      id: '1', 
      name: '田中さん', 
      location: [36.2557, 136.6352],
      avatarStyle: {
        skinColor: 'light',
        hairStyle: 'short',
        hairColor: 'brown',
        clothing: 'blue',
        accessory: 'none',
        face: 'happy',
        background: 'transparent'
      }
    },
    { 
      id: '2', 
      name: '佐藤さん', 
      location: [36.2537, 136.6332],
      avatarStyle: {
        skinColor: 'light',
        hairStyle: 'long',
        hairColor: 'black',
        clothing: 'red',
        accessory: 'glasses',
        face: 'happy',
        background: 'transparent'
      }
    },
    { 
      id: '3', 
      name: '山田さん', 
      location: [36.2567, 136.6362],
      avatarStyle: {
        skinColor: 'light',
        hairStyle: 'short',
        hairColor: 'blonde',
        clothing: 'green',
        accessory: 'hat',
        face: 'happy',
        background: 'transparent'
      }
    }
  ]);

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
            setUserLocation([latitude, longitude]);
            setGpsAccuracy(accuracy);
            setLocationPermission('granted');
            setIsLoading(false);
          },
          (error) => {
            console.error('位置情報取得エラー:', error);
            console.log('白峰地域のデフォルト位置を使用します');
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER);
            setIsLoading(false);
          },
          options
        );
      } else {
        console.log('Geolocation APIが利用できません');
        setLocationPermission('denied');
        setUserLocation(HAKUMINE_CENTER);
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
  };

  const requestLocationPermission = () => {
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
          setUserLocation(HAKUMINE_CENTER);
        },
        options
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">位置情報を読み込み中...</p>
            </div>
          </div>
        </div>
        <XNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6 pb-24">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white shadow-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📍 村の地図</h1>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="bg-white shadow-sm">
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
          </Link>
        </div>

        {/* 位置情報ステータス */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
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
                  {locationPermission === 'granted' ? 'GPS接続中' : 'GPS未接続'}
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
                <p className="text-sm font-medium text-gray-700 mb-2">📍 現在位置</p>
                <p className="text-xs text-gray-600">
                  緯度: {userLocation[0].toFixed(6)}<br />
                  経度: {userLocation[1].toFixed(6)}
                </p>
                {gpsAccuracy && (
                  <p className="text-xs text-gray-500 mt-1">
                    精度: ±{Math.round(gpsAccuracy)}m
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">位置情報を共有</span>
              <Button
                onClick={toggleLocationSharing}
                variant={locationSharing ? "default" : "outline"}
                size="sm"
                disabled={locationPermission !== 'granted'}
                className={locationSharing ? "bg-green-500 hover:bg-green-600" : ""}
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

        {/* Leaflet地図 */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle>🗺️ 白峰大学村マップ</CardTitle>
            <CardDescription>
              リアルタイムで学生の位置と村の施設が表示されます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent
              center={userLocation || HAKUMINE_CENTER}
              zoom={15}
              userLocation={userLocation}
              showUserLocation={locationPermission === 'granted'}
              className="w-full h-[500px]"
              onlineUsers={onlineUsers.map(user => ({
                id: user.id,
                name: user.name,
                position: user.location as [number, number],
                avatarStyle: user.avatarStyle,
                isCurrentUser: false
              })).concat(userLocation && user ? [{
                id: 'current-user',
                name: user.displayName || 'あなた',
                position: userLocation,
                avatarStyle: {
                  skinColor: 'light',
                  hairStyle: 'short',
                  hairColor: 'brown',
                  clothing: 'blue',
                  accessory: 'none',
                  face: 'happy',
                  background: 'transparent'
                },
                isCurrentUser: true
              }] : [])}
            />
          </CardContent>
        </Card>

        {/* オンラインユーザー */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>オンラインの学生</span>
              <span className="text-sm text-gray-500">({onlineUsers.length}人)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {onlineUsers.length > 0 ? (
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">📍 白峰村内</p>
                    </div>
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">現在オンラインの学生はいません</p>
                <p className="text-xs text-gray-400">
                  {user ? `${user.displayName || 'あなた'}がオンライン中です` : 'ログインしてください'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* X風ナビゲーション */}
      <XNavigation />
    </div>
  );
}
