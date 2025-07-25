import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * ゲストとして匿名ログイン
 */
export const signInAsGuest = async (): Promise<User | null> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return null;
    }

    const result = await signInAnonymously(auth);
    const user = result.user;

    // ゲストユーザー情報をFirestoreに保存
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: `ゲスト_${user.uid.slice(-6)}`,
          email: null,
          isAnonymous: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          avatar: '🎭', // ゲスト用デフォルトアバター
          university: '',
          department: '',
          grade: '',
          bio: 'ゲストユーザーです',
          isLocationVisible: true,
          isOnline: true,
        });
      } else {
        // 最終ログイン時刻を更新
        await setDoc(userRef, {
          lastLoginAt: new Date().toISOString(),
          isOnline: true,
        }, { merge: true });
      }
    }

    console.log('Guest sign in successful:', user.uid);
    return user;
  } catch (error) {
    console.error('Guest sign in error:', error);
    return null;
  }
};

/**
 * メール・パスワードでログイン
 */
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return null;
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // ログイン時刻を更新
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
        isOnline: true,
      }, { merge: true });
    }

    console.log('Email sign in successful:', user.uid);
    return user;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

/**
 * 新規ユーザー登録
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: {
    displayName: string;
    university: string;
    department: string;
    grade: string;
  }
): Promise<User | null> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return null;
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // ユーザー情報をFirestoreに保存
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        university: userData.university,
        department: userData.department,
        grade: userData.grade,
        isAnonymous: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        avatar: '👤', // デフォルトアバター
        bio: '',
        isLocationVisible: true,
        isOnline: true,
      });
    }

    console.log('Sign up successful:', user.uid);
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * ログアウト
 */
export const signOut = async (): Promise<void> => {
  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return;
    }

    const currentUser = auth.currentUser;
    
    // オフライン状態に更新
    if (currentUser && db) {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        isOnline: false,
        lastSeenAt: new Date().toISOString(),
      }, { merge: true });
    }

    await firebaseSignOut(auth);
    console.log('Sign out successful');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = (): User | null => {
  if (!auth) {
    console.warn('Firebase Auth not initialized');
    return null;
  }
  return auth.currentUser;
};

/**
 * ユーザーがゲストかどうかを判定
 */
export const isGuestUser = (user: User | null): boolean => {
  return user ? user.isAnonymous : false;
};
