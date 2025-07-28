'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { doc, updateDoc, onSnapshot, collection, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function AvatarMovement() {
  const { user, isGuest } = useAuthStore();
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');
  const [otherUsers, setOtherUsers] = useState<UserAvatar[]>([]);
  const [userAvatar, setUserAvatar] = useState<any>(null);

  // ユーザーのアバター設定を取得
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    
    if (isGuest) {
      // ゲストユーザーの場合、localStorageからアバター設定を取得
      const guestData = localStorage.getItem('guest_user');
      if (guestData) {
        const guest = JSON.parse(guestData);
        setUserAvatar(guest.avatarConfig || null);
      }
    } else {
      // 通常ユーザーの場合はuser.avatarConfigを使用
      setUserAvatar(user.avatarConfig || null);
    }
  }, [user, isGuest]);

  // Firebase同期：自分の位置を初期化
  useEffect(() => {
    if (!user) return;
    
    // ゲストユーザーの場合はFirebase同期をスキップ
    if (isGuest) {
      console.log('ゲストユーザーのため、Firebase同期をスキップします');
      return;
    }

    const initializeUserPosition = async () => {
      try {
        const userRef = doc(db, 'userPositions', user.uid);
        await setDoc(userRef, {
          position: { x: 50, y: 50 },
          direction: 'down',
          isMoving: false,
          lastSeen: new Date(),
          name: user.displayName || '匿名',
          updatedAt: new Date()
        }, { merge: true });
      } catch (error) {
        console.error('Failed to initialize position:', error);
      }
    };

    initializeUserPosition();
  }, [user, isGuest]);

  // Firebase同期：自分の位置を更新
  const updateUserPosition = async (newPosition: Position, newDirection: string, moving: boolean) => {
    if (!user || isGuest) return; // ゲストユーザーの場合はFirebase更新をスキップ

    try {
      const userRef = doc(db, 'userPositions', user.uid);
      await updateDoc(userRef, {
        position: newPosition,
        direction: newDirection,
        isMoving: moving,
        lastSeen: new Date(),
        name: user.displayName || '匿名',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  };

  // 他のユーザーの位置を監視
  useEffect(() => {
    if (!user) return;
    
    // ゲストユーザーの場合はFirebase監視をスキップ
    if (isGuest) {
      console.log('ゲストユーザーのため、他ユーザー監視をスキップします');
      return;
    }

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
            lastSeen: data.lastSeen?.toDate() || new Date()
          });
        }
      });
      setOtherUsers(users);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  // キーボード移動処理
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      const moveSpeed = 2;
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

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [position, direction, updateUserPosition]);

  return (
    <>
      {typeof window !== 'undefined' && (
        <div className="relative w-full h-full">
          {/* 自分のアバター */}
          <div
            className={`absolute transition-all duration-200 ${isMoving ? 'animate-bounce' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`
              w-12 h-12 rounded-full border-4 border-blue-600 bg-blue-500 
              flex items-center justify-center text-white font-bold text-sm
              ${isMoving ? 'scale-110' : 'scale-100'}
              transition-transform duration-200
              ${direction === 'left' ? 'scale-x-[-1]' : ''}
            `}>
              {user?.displayName?.charAt(0) || '?'}
            </div>

            {/* 移動方向インジケーター */}
            {isMoving && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            )}

            {/* 名前表示 */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              {user?.displayName || 'あなた'}
            </div>
          </div>

          {/* 他のユーザーのアバター */}
          {otherUsers.map((otherUser) => {
            const isRecent = new Date().getTime() - otherUser.lastSeen.getTime() < 30000; // 30秒以内
            if (!isRecent) return null;

            return (
              <div
                key={otherUser.id}
                className={`absolute transition-all duration-300 ${otherUser.isMoving ? 'animate-bounce' : ''}`}
                style={{
                  left: `${otherUser.position.x}%`,
                  top: `${otherUser.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`
                  w-12 h-12 rounded-full border-4 border-green-600 bg-green-500 
                  flex items-center justify-center text-white font-bold text-sm
                  ${otherUser.isMoving ? 'scale-110' : 'scale-100'}
                  transition-transform duration-200
                  ${otherUser.direction === 'left' ? 'scale-x-[-1]' : ''}
                `}>
                  {otherUser.name?.charAt(0) || '?'}
                </div>

                {/* 移動方向インジケーター */}
                {otherUser.isMoving && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                )}

                {/* 名前表示 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {otherUser.name}
                </div>
              </div>
            );
          })}

          {/* 操作説明とオンライン人数 */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg text-xs">
            <p className="font-medium mb-1">アバター操作：</p>
            <p>矢印キー または WASD で移動</p>
            <p className="text-green-600 mt-2">オンライン: {otherUsers.length + 1}人</p>
          </div>
        </div>
      )}
    </>
  );
}
