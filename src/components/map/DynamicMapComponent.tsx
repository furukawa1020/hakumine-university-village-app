'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';

// Leaflet アイコンの修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface DynamicMapProps {
  userLocation: [number, number];
  locationSharing: boolean;
  userName: string;
}

export default function DynamicMapComponent({ userLocation, locationSharing, userName }: DynamicMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    // Leaflet CSS を動的に読み込み
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // マップ初期化
    if (!map && userLocation) {
      const mapInstance = L.map('map').setView(userLocation, 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      setMap(mapInstance);
    }

    return () => {
      // クリーンアップ
      document.head.removeChild(link);
    };
  }, []);

  // ユーザー位置マーカーの更新
  useEffect(() => {
    if (!map || !userLocation) return;

    // 既存のマーカーを削除
    if (userMarker) {
      map.removeLayer(userMarker);
    }

    // 位置共有が有効な場合のみマーカーを表示
    if (locationSharing) {
      const marker = L.marker(userLocation)
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #2563eb;">あなたの位置</div>
            <div style="font-size: 0.875rem; color: #6b7280;">${userName}</div>
          </div>
        `);
      
      setUserMarker(marker);
    }

    // マップ中心を更新
    map.setView(userLocation, map.getZoom());
  }, [map, userLocation, locationSharing, userName]);

  return (
    <div 
      id="map" 
      style={{ 
        height: '100%', 
        width: '100%',
        minHeight: '400px'
      }} 
    />
  );
}
