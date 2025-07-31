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

const HAKUMINE_CENTER = [36.2547, 136.6342];

export default function MapClient() {
  const { user } = useAuthStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
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
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER as [number, number]);
            setIsLoading(false);
          },
          options
        );
      } else {
        setLocationPermission('denied');
        setUserLocation(HAKUMINE_CENTER as [number, number]);
        setIsLoading(false);
      }
    };

    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
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
        getCurrentLocation();
      });
    } else {
      getCurrentLocation();
    }
  }, []);

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    console.log('位置情報共有:', !locationSharing ? '有効' : '無効');
  };

  const requestLocationPermission = () => {
    if (typeof window === 'undefined') return;
    
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
                {locationPermission === 'granted' ? '位置情報利用可能' : '位置情報が利用できません'}
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
            白峰大学村の地図機能を準備中です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-200 to-transparent"></div>
              <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-green-300 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-blue-300 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10 space-y-4">
              <AlertCircle className="h-16 w-16 text-blue-600 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800">地図機能は準備中です</h3>
              <p className="text-gray-600 max-w-md">
                現在、より安定したマップ機能を開発中です。<br />
                位置情報の取得と共有機能は利用できます。
              </p>
              
              {userLocation && (
                <div className="mt-6 p-4 bg-white/80 rounded-lg backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-700 mb-2">📍 あなたの現在位置</p>
                  <p className="text-xs text-gray-600">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                </div>
              )}
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
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">現在オンラインの学生はいません</p>
            <p className="text-xs text-gray-400">
              {user && user.displayName ? `${user.displayName}がオンラインです` : 'ログインしてオンライン状態を表示'}
            </p>
          </div>
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
            <SimpleAvatarMovement />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
