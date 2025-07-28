'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface Position {
  x: number;
  y: number;
}

export default function SimpleAvatarMovement() {
  const { user } = useAuthStore();
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);

  // キーボードイベントハンドラー
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    const step = 2; // 移動ステップ
    let newPosition = { ...position };
    let newDirection = direction;
    
    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        newPosition.y = Math.max(5, newPosition.y - step);
        newDirection = 'up';
        break;
      case 'arrowdown':
      case 's':
        newPosition.y = Math.min(95, newPosition.y + step);
        newDirection = 'down';
        break;
      case 'arrowleft':
      case 'a':
        newPosition.x = Math.max(5, newPosition.x - step);
        newDirection = 'left';
        break;
      case 'arrowright':
      case 'd':
        newPosition.x = Math.min(95, newPosition.x + step);
        newDirection = 'right';
        break;
      default:
        return;
    }

    setPosition(newPosition);
    setDirection(newDirection);
    setIsMoving(true);
    
    // 移動終了タイマー
    setTimeout(() => setIsMoving(false), 300);
  }, [position, direction]);

  // キーボードイベントリスナーの設定
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // アバター表示の取得
  const getAvatarDisplay = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return 'G';
  };

  const getAvatarName = () => {
    return user?.displayName || 'ゲスト';
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* アバター */}
      <div
        className={`absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
          isMoving ? 'scale-110' : 'scale-100'
        }`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        <div className="relative">
          {/* アバター本体 */}
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-colors duration-200 ${
              isMoving ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            {getAvatarDisplay()}
          </div>
          
          {/* 方向インジケーター */}
          <div className="absolute -top-1 -right-1 w-4 h-4">
            <div className={`w-0 h-0 transform transition-transform duration-200 ${
              direction === 'up' ? 'border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500' :
              direction === 'down' ? 'border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500' :
              direction === 'left' ? 'border-t-2 border-b-2 border-r-4 border-transparent border-r-red-500' :
              'border-t-2 border-b-2 border-l-4 border-transparent border-l-red-500'
            }`} />
          </div>
        </div>
        
        {/* 名前表示 */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
          <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-gray-700 shadow-sm whitespace-nowrap">
            {getAvatarName()}
          </div>
        </div>
        
        {/* 移動時のエフェクト */}
        {isMoving && (
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-ping" />
        )}
      </div>
      
      {/* グリッド表示（開発時のみ） */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
    </div>
  );
}
