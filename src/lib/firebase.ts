import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase設定（環境変数を使用）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// Firebase Services（動的初期化）
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDB: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;

// Firebase初期化関数（遅延初期化）
function initializeFirebase() {
  if (typeof window === 'undefined') return null;
  
  try {
    // すでに初期化済みの場合は既存のアプリを使用
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
    } else {
      // 設定値チェック
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error('Firebase configuration is incomplete');
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    // Services を初期化
    if (firebaseApp && !firebaseAuth) {
      firebaseAuth = getAuth(firebaseApp);
      firebaseDB = getFirestore(firebaseApp);
      firebaseStorage = getStorage(firebaseApp);
    }

    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDB, storage: firebaseStorage };
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return null;
  }
}

// Getter関数（使用時に初期化）
export function getFirebaseAuth(): Auth | null {
  if (!firebaseAuth) initializeFirebase();
  return firebaseAuth;
}

export function getFirebaseDB(): Firestore | null {
  if (!firebaseDB) initializeFirebase();
  return firebaseDB;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (!firebaseStorage) initializeFirebase();
  return firebaseStorage;
}

// 後方互換性のため（既存コードで使用されている場合）
export const auth = getFirebaseAuth();
export const db = getFirebaseDB();
export const storage = getFirebaseStorage();

// Messaging は無効化
export const messaging = null;
