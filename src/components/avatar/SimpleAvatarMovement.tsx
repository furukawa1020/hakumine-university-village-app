'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface Position {
  x: number;
  y: number;
}

interface UserAvatar {
  id: string;
  name: string;
  position: Position;
  isMoving: boolean;
  direction: string;
  lastSeen: Date;
}

export default function SimpleAvatarMovement() {
  const { user, isGuest } = useAuthStore();
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');
  const [userAvatar, setUserAvatar] = useState<any>(null);

  // ユーザーのアバター設定を取得
  useEffect(() => {
    if (!user) return;
    
    if (isGuest) {
      // ゲストユーザーの場合
      try {
        const guestData = localStorage.getItem('hakumine_guest_user');
        if (guestData) {
          const guest = JSON.parse(guestData);
          setUserAvatar(guest.avatarConfig || null);
        }
      } catch (error) {
        console.error('ゲストアバター設定の取得に失敗:', error);
      }
    } else {
      // 通常ユーザーの場合
      setUserAvatar(user.avatarConfig || null);
    }
  }, [user, isGuest]);

  // キーボードイベントハンドラー
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!user) return;

    const moveDistance = 5;
    let newPosition = { ...position };
    let newDirection = direction;
    let moved = false;

    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        if (newPosition.y > 0) {
          newPosition.y = Math.max(0, newPosition.y - moveDistance);
          newDirection = 'up';
          moved = true;
        }
        break;
      case 'arrowdown':
      case 's':
        if (newPosition.y < 100) {
          newPosition.y = Math.min(100, newPosition.y + moveDistance);
          newDirection = 'down';
          moved = true;
        }
        break;
      case 'arrowleft':
      case 'a':
        if (newPosition.x > 0) {
          newPosition.x = Math.max(0, newPosition.x - moveDistance);
          newDirection = 'left';
          moved = true;
        }
        break;
      case 'arrowright':
      case 'd':
        if (newPosition.x < 100) {
          newPosition.x = Math.min(100, newPosition.x + moveDistance);
          newDirection = 'right';
          moved = true;
        }
        break;
    }

    if (moved) {
      setPosition(newPosition);
      setDirection(newDirection);
      setIsMoving(true);
      
      // 移動アニメーション終了
      setTimeout(() => setIsMoving(false), 200);
    }
  }, [position, direction, user]);

  // キーボードイベントの登録
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // アバター表示コンポーネント
  const AvatarDisplay = ({ position, direction, isMoving, name }: {
    position: Position;
    direction: string;
    isMoving: boolean;
    name: string;
  }) => {
    const getAvatarColor = () => {
      if (userAvatar?.clothing) {
        const colorMap: Record<string, string> = {
          'blue': 'bg-blue-500',
          'red': 'bg-red-500', 
          'green': 'bg-green-500',
          'yellow': 'bg-yellow-500',
          'purple': 'bg-purple-500',
          'orange': 'bg-orange-500'
        };
        return colorMap[userAvatar.clothing] || 'bg-blue-500';
      }
      
      // 方向によるデフォルト色
      return direction === 'up' ? 'bg-blue-500' : 
             direction === 'down' ? 'bg-green-500' : 
             direction === 'left' ? 'bg-yellow-500' : 
             'bg-red-500';
    };

    const getAvatarInitials = () => {
      if (userAvatar?.face === 'happy') return '😊';
      if (userAvatar?.face === 'smile') return '😄';
      if (userAvatar?.face === 'wink') return '😉';
      if (userAvatar?.face === 'cool') return '😎';
      if (userAvatar?.face === 'surprise') return '😮';
      return name.charAt(0).toUpperCase();
    };

    return (
      <div
        className={`
          absolute w-12 h-12 transition-all duration-200 z-20
          ${isMoving ? 'scale-110' : 'scale-100'}
        `}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="relative">
          {/* アバターアイコン */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm
            ${isMoving ? 'animate-bounce' : ''}
            ${getAvatarColor()}
            border-2 border-white shadow-lg
          `}>
            <span className="text-lg">
              {getAvatarInitials()}
            </span>
          </div>
          
          {/* アクセサリー表示 */}
          {userAvatar?.accessory && userAvatar.accessory !== 'none' && (
            <div className="absolute -top-1 -right-1">
              {userAvatar.accessory === 'hat' && <span className="text-lg">🎩</span>}
              {userAvatar.accessory === 'crown' && <span className="text-lg">👑</span>}
              {userAvatar.accessory === 'glasses' && <span className="text-lg">👓</span>}
              {userAvatar.accessory === 'earphones' && <span className="text-lg">🎧</span>}
            </div>
          )}
          
          {/* 名前表示 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {name}
            </div>
          </div>
          
          {/* 方向矢印 */}
          <div className="absolute -top-2 -right-2">
            <div className={`
              w-4 h-4 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center
              transform transition-transform duration-200
              ${direction === 'up' ? 'rotate-0' : 
                direction === 'right' ? 'rotate-90' : 
                direction === 'down' ? 'rotate-180' : 
                'rotate-270'}
            `}>
              <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-500 text-sm">ユーザー情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300">
      {/* 地図の背景パターン */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={`${i * 10}%`} y1="0%" x2={`${i * 10}%`} y2="100%" stroke="#64748b" strokeWidth="1" />
              <line x1="0%" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#64748b" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>
      
      {/* 自分のアバター */}
      <AvatarDisplay
        position={position}
        direction={direction}
        isMoving={isMoving}
        name={user.displayName || 'あなた'}
      />
      
      {/* 操作ヒント */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
        <div>
          <p className="font-medium mb-1">アバター操作:</p>
          <p>矢印キー または WASD で移動</p>
          <p className="text-gray-500 mt-1">
            現在位置: ({position.x.toFixed(0)}, {position.y.toFixed(0)})
          </p>
        </div>
        
        {userAvatar && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1">アバター設定:</p>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${
                userAvatar.clothing === 'blue' ? 'bg-blue-500' :
                userAvatar.clothing === 'red' ? 'bg-red-500' :
                userAvatar.clothing === 'green' ? 'bg-green-500' :
                userAvatar.clothing === 'yellow' ? 'bg-yellow-500' :
                userAvatar.clothing === 'purple' ? 'bg-purple-500' :
                userAvatar.clothing === 'orange' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}></div>
              <span className="text-xs">{userAvatar.clothing || 'blue'}</span>
              {userAvatar.accessory && userAvatar.accessory !== 'none' && (
                <>
                  <span className="text-xs">+</span>
                  <span className="text-xs">{userAvatar.accessory}</span>
                </>
              )}
            </div>
            <Link href="/settings/avatar" className="text-blue-600 hover:underline text-xs">
              設定を変更
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
