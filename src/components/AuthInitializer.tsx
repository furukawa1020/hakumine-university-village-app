'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, loadGuestUser, user } = useAuthStore();

  useEffect(() => {
    // サーバーサイドでは実行しない
    if (typeof window === 'undefined') {
      return;
    }

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // まずゲストユーザーを試行
        loadGuestUser();
        
        // Firebase認証の動的インポート（SSRエラーを防ぐ）
        try {
          const { onAuthStateChanged } = await import('firebase/auth');
          const { auth } = await import('@/lib/firebase');
          
          // auth が利用可能な場合のみ監視
          if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
              if (firebaseUser) {
                // Firebase認証済みユーザー
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email!,
                  displayName: firebaseUser.displayName || '',
                  photoURL: firebaseUser.photoURL || '',
                  avatarConfig: {
                    face: 0,
                    hair: 0,
                    body: 0,
                    accessory: 0
                  },
                  settings: {
                    privacy: {
                      showLocation: false,
                      locationPrecision: 'area',
                      profileVisibility: 'public',
                      logVisibility: 'public',
                      locationSharing: false,
                      locationGranularity: 'rough',
                    },
                    notifications: {
                      questNotifications: true,
                      chatNotifications: true,
                      systemNotifications: true,
                      emailNotifications: false,
                    },
                  },
                  status: 'online',
                  joinedAt: new Date(),
                  lastActiveAt: new Date(),
                  isGuest: false,
                });
              } else {
                // Firebase認証されていない場合、ゲストユーザーを維持
                if (!user) {
                  loadGuestUser();
                }
              }
            });

            // クリーンアップ関数を返す
            return unsubscribe;
          }
        } catch (firebaseError) {
          console.warn('Firebase authentication not available:', firebaseError);
          // Firebaseが利用できない場合はゲストユーザーとして続行
          if (!user) {
            loadGuestUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // エラーが発生した場合もゲストユーザーとして続行
        if (!user) {
          loadGuestUser();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setLoading, loadGuestUser, user]);

  return <>{children}</>;
}