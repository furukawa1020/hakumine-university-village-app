'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { doc, updateDoc, onSnapshot, collection, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PixelAvatar, PixelAvatarStyle } from './PixelAvatar';
import PixelAvatarCustomizer from './PixelAvatarCustomizer';

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
  avatar: PixelAvatarStyle;
}

interface AvatarStyle {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothing: string;
  accessory: string;
  face: string;
  background: string;
}

// アバターの移動状態とリアルタイム同期を管理するコンポーネント
export function AvatarMovement() {
  const { user } = useAuthStore();
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('down');
  const [otherUsers, setOtherUsers] = useState<UserAvatar[]>([]);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>({
    skinColor: 'light',
    hairStyle: 'short',
    hairColor: 'black',
    clothing: 'blue',
    accessory: 'none',
    face: 'normal',
    background: 'none'
  });

  // Firebase同期：自分の位置を初期化
  useEffect(() => {
    if (!user) return;

    const initializeUserPosition = async () => {
      try {
        const userRef = doc(db, 'userPositions', user.uid);
        await setDoc(userRef, {
          position: { x: 50, y: 50 },
          direction: 'down',
          isMoving: false,
          lastSeen: new Date(),
          name: user.displayName || '匿名',
          avatar: avatarStyle,
          updatedAt: new Date()
        }, { merge: true });
      } catch (error) {
        console.error('Failed to initialize position:', error);
      }
    };

    initializeUserPosition();
  }, [user, avatarStyle]);

  // Firebase同期：自分の位置を更新
  const updateUserPosition = async (newPosition: Position, newDirection: string, moving: boolean) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'userPositions', user.uid);
      await updateDoc(userRef, {
        position: newPosition,
        direction: newDirection,
        isMoving: moving,
        lastSeen: new Date(),
        name: user.displayName || '匿名',
        avatar: avatarStyle,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  };

  // 他のユーザーの位置を監視
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, 'userPositions'), (snapshot) => {
      const users: UserAvatar[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== user.uid) { // 自分以外のユーザー
          users.push({
            id: doc.id,
            name: data.name || '匿名',
            position: data.position || { x: 50, y: 50 },
            isMoving: data.isMoving || false,
            direction: data.direction || 'down',
            lastSeen: data.lastSeen?.toDate() || new Date(),
            avatar: data.avatar || { color: 'green', shape: 'circle', accessory: 'none' }
          });
        }
      });
      setOtherUsers(users);
    });

    return () => unsubscribe();
  }, [user]);
  // キーボード操作でアバターを移動
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const moveSpeed = 2; // 移動速度（%）
      let newPosition = { ...position };
      let newDirection = direction;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newPosition.x = Math.max(0, position.x - moveSpeed);
          newDirection = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newPosition.x = Math.min(100, position.x + moveSpeed);
          newDirection = 'right';
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          newPosition.y = Math.max(0, position.y - moveSpeed);
          newDirection = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newPosition.y = Math.min(100, position.y + moveSpeed);
          newDirection = 'down';
          break;
        default:
          return;
      }

      setPosition(newPosition);
      setDirection(newDirection);
      setIsMoving(true);

      // Firebase に位置を同期
      updateUserPosition(newPosition, newDirection, true);

      // 移動アニメーションを停止
      setTimeout(() => {
        setIsMoving(false);
        updateUserPosition(newPosition, newDirection, false);
      }, 200);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [position, direction, updateUserPosition]);

  // アバタースタイルを保存
  const saveAvatarStyle = async (newStyle: AvatarStyle) => {
    setAvatarStyle(newStyle);
    if (user) {
      try {
        const userRef = doc(db, 'userPositions', user.uid);
        await updateDoc(userRef, {
          avatar: newStyle,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Failed to save avatar style:', error);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 自分のアバター */}
      <div
        className="absolute transition-all duration-200"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <PixelAvatar
          style={avatarStyle}
          size={48}
          isMoving={isMoving}
          direction={direction}
          showName={user?.displayName || 'あなた'}
        />
      </div>

      {/* 他のユーザーのアバター */}
      {otherUsers.map((otherUser) => {
        const isRecent = new Date().getTime() - otherUser.lastSeen.getTime() < 30000; // 30秒以内
        if (!isRecent) return null;

        return (
          <div
            key={otherUser.id}
            className="absolute transition-all duration-300"
            style={{
              left: `${otherUser.position.x}%`,
              top: `${otherUser.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <PixelAvatar
              style={otherUser.avatar}
              size={48}
              isMoving={otherUser.isMoving}
              direction={otherUser.direction}
              showName={otherUser.name}
            />
          </div>
        );
      })}

      {/* オンラインユーザー一覧 */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
        <h3 className="font-bold text-sm mb-2 text-gray-800">オンライン ({otherUsers.length + 1}人)</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {/* 自分 */}
          <div className="flex items-center gap-2 text-xs">
            <PixelAvatar style={avatarStyle} size={24} />
            <span className="text-blue-600 font-medium">{user?.displayName || 'あなた'}</span>
            <span className="text-gray-500">({Math.round(position.x)}, {Math.round(position.y)})</span>
          </div>
          
          {/* 他のユーザー */}
          {otherUsers.map((otherUser) => {
            const isRecent = new Date().getTime() - otherUser.lastSeen.getTime() < 30000;
            if (!isRecent) return null;
            
            return (
              <div key={otherUser.id} className="flex items-center gap-2 text-xs">
                <PixelAvatar style={otherUser.avatar} size={24} />
                <span className="text-green-600 font-medium">{otherUser.name}</span>
                <span className="text-gray-500">({Math.round(otherUser.position.x)}, {Math.round(otherUser.position.y)})</span>
                {otherUser.isMoving && <span className="text-orange-500">移動中</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* アバターカスタマイズボタン */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          🎨 アバター編集
        </button>
      </div>

      {/* アバターカスタマイザー */}
      {showCustomizer && (
        <PixelAvatarCustomizer
          currentStyle={avatarStyle}
          onStyleChange={saveAvatarStyle}
          onClose={() => setShowCustomizer(false)}
        />
      )}

      {/* 操作説明 */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg text-xs">
        <p className="font-medium mb-1">操作方法：</p>
        <p>矢印キー または WASD で移動</p>
        <p>🎨ボタンでアバター変更</p>
        <p className="text-green-600 mt-1">オンライン: {otherUsers.length + 1}人</p>
      </div>
    </div>
  );
}

// 他のユーザーのアバターを表示するコンポーネント
export function OtherUserAvatar({ 
  user, 
  position 
}: { 
  user: { name: string; status: string }, 
  position: { x: number; y: number } 
}) {
  return (
    <div
      className="absolute transition-all duration-1000"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`
        w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-xs
        ${user.status === 'online' 
          ? 'border-green-600 bg-green-500' 
          : 'border-gray-600 bg-gray-500'
        }
      `}>
        {user.name.charAt(0)}
      </div>
      
      {/* ユーザー名表示 */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
          {user.name}
        </div>
      </div>
    </div>
  );
}
