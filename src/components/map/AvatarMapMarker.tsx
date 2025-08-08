'use client';

import L from 'leaflet';
import { PixelAvatarRenderer } from '@/components/avatar/PixelAvatarRenderer';
import { useEffect, useRef } from 'react';

interface AvatarMapMarkerProps {
  map: L.Map;
  position: [number, number];
  avatarStyle: {
    skinColor: string;
    hairStyle: string;
    hairColor: string;
    clothing: string;
    accessory: string;
    face: string;
    background: string;
  };
  userName: string;
  userId: string;
  isCurrentUser?: boolean;
}

export const AvatarMapMarker: React.FC<AvatarMapMarkerProps> = ({
  map,
  position,
  avatarStyle,
  userName,
  userId,
  isCurrentUser = false
}) => {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Canvas要素でピクセルアバターを作成
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // ピクセルアバターを描画（簡易版）
    const drawPixelAvatar = () => {
      // 背景（透明）
      ctx.clearRect(0, 0, 32, 32);
      
      // 現在のユーザーには特別なリング
      if (isCurrentUser) {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // 顔のベース（簡易）
      ctx.fillStyle = avatarStyle.skinColor === 'light' ? '#FDBCB4' : '#8D5524';
      ctx.fillRect(8, 8, 16, 16);
      
      // 髪
      ctx.fillStyle = avatarStyle.hairColor === 'brown' ? '#8B4513' : 
                      avatarStyle.hairColor === 'black' ? '#000000' :
                      avatarStyle.hairColor === 'blonde' ? '#FFD700' : '#8B4513';
      ctx.fillRect(8, 6, 16, 6);
      
      // 服装
      ctx.fillStyle = avatarStyle.clothing === 'blue' ? '#3B82F6' :
                      avatarStyle.clothing === 'red' ? '#EF4444' :
                      avatarStyle.clothing === 'green' ? '#10B981' : '#3B82F6';
      ctx.fillRect(8, 20, 16, 8);
      
      // 目
      ctx.fillStyle = '#000000';
      ctx.fillRect(10, 12, 2, 2);
      ctx.fillRect(20, 12, 2, 2);
      
      // 口
      if (avatarStyle.face === 'happy') {
        ctx.fillRect(14, 16, 4, 1);
        ctx.fillRect(12, 17, 2, 1);
        ctx.fillRect(18, 17, 2, 1);
      }
    };

    drawPixelAvatar();

    // Canvas からアイコンを作成
    const iconUrl = canvas.toDataURL();
    
    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
      className: isCurrentUser ? 'current-user-marker' : 'user-marker'
    });

    // マーカーを作成
    const marker = L.marker(position, { icon: customIcon }).addTo(map);
    
    // ポップアップを追加
    marker.bindPopup(`
      <div class="p-3 min-w-[120px]">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8">
            <canvas id="popup-avatar-${userId}" width="32" height="32" style="width: 32px; height: 32px; image-rendering: pixelated;"></canvas>
          </div>
          <div>
            <h3 class="font-bold text-sm">${userName}</h3>
            ${isCurrentUser ? '<span class="text-xs text-blue-600">あなた</span>' : '<span class="text-xs text-gray-500">オンライン</span>'}
          </div>
        </div>
        <div class="text-xs text-gray-600">
          位置: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}
        </div>
      </div>
    `);

    // ポップアップが開かれたときにアバターを再描画
    marker.on('popupopen', () => {
      setTimeout(() => {
        const popupCanvas = document.getElementById(`popup-avatar-${userId}`) as HTMLCanvasElement;
        if (popupCanvas) {
          const popupCtx = popupCanvas.getContext('2d');
          if (popupCtx) {
            popupCtx.clearRect(0, 0, 32, 32);
            drawPixelAvatar();
            popupCtx.drawImage(canvas, 0, 0);
          }
        }
      }, 100);
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current && map) {
        map.removeLayer(markerRef.current);
      }
    };
  }, [map, position, avatarStyle, userName, userId, isCurrentUser]);

  // 位置更新
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return null;
};
