'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Leafletを動的インポート（SSR回避）
import dynamic from 'next/dynamic';

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

// AvatarMovementRealtimeを動的インポート
const AvatarMovementRealtime = dynamic(
  () => import('@/components/avatar/AvatarMovementRealtime'),
  { ssr: false }
);

interface MapComponentProps {
  userLocation: [number, number] | null;
  locationSharing: boolean;
  onRequestLocationPermission: () => void;
}

// Leafletアイコンの修正（クライアントサイドでのみ実行）
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    try {
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    } catch (error) {
      console.error('Failed to fix Leaflet icons:', error);
    }
  }
};

export default function MapComponent({ 
  userLocation, 
  locationSharing, 
  onRequestLocationPermission 
}: MapComponentProps) {
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // クライアントサイドでのみレンダリング
  useEffect(() => {
    setIsClient(true);
    try {
      fixLeafletIcons();
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('マップの初期化に失敗しました');
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">マップを準備中...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-2">{mapError}</p>
          <Button onClick={() => window.location.reload()}>
            ページを再読み込み
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {userLocation ? (
        <div className="h-full w-full">
          {/* マップコンテナ */}
          <div className="h-full w-full relative">
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
              {locationSharing && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">あなたの位置</div>
                      <div className="text-sm text-gray-600">{user?.displayName || 'ユーザー'}</div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

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
          </div>
        </div>
      ) : (
        /* マップが読み込めない場合のフォールバック */
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">位置情報を取得できませんでした</p>
            <p className="text-sm text-gray-500 mb-4">位置情報を許可してください</p>
            <Button className="mt-4" onClick={onRequestLocationPermission}>
              位置情報を許可する
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
