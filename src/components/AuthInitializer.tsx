'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, loadGuestUser, user } = useAuthStore();

  useEffect(() => {
    // auth が初期化されていない場合は待機
    if (!auth) {
      loadGuestUser();
      return;
    }

    // Firebase認証の状態変更を監視
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
        // Firebase認証されていない場合、ゲストユーザーをチェック
        loadGuestUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, loadGuestUser]);

  return <>{children}</>;
}
