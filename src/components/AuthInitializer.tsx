'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, loadGuestUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Firebase設定をチェック
        const hasFirebaseConfig = 
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key' &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project';

        if (!hasFirebaseConfig) {
          console.log('Firebase設定が不完全です。ゲストモードで開始します。');
          if (mounted) {
            loadGuestUser();
            setLoading(false);
          }
          return;
        }

        // Firebase認証を動的に読み込み
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');

        if (!auth || !mounted) {
          loadGuestUser();
          setLoading(false);
          return;
        }

        // Firebase認証の状態変更を監視
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (!mounted) return;

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
              isGuest: false
            });
          } else {
            // 未認証の場合はゲストユーザーを読み込み
            loadGuestUser();
          }
          setLoading(false);
        });

        return () => {
          mounted = false;
          unsubscribe();
        };
      } catch (error) {
        console.error('Firebase認証の初期化に失敗しました:', error);
        if (mounted) {
          loadGuestUser();
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setUser, setLoading, loadGuestUser]);

  return <>{children}</>;
}
