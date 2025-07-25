import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase設定（本番環境では環境変数から読み込み）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// サービスの初期化
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// FCM（Push通知）の初期化（ブラウザでサポートされている場合のみ）
export const messaging = typeof window !== 'undefined' ? (async () => {
  try {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
  } catch (error) {
    console.warn('Firebase messaging is not supported in this browser');
    return null;
  }
})() : null;

// 開発環境でのエミュレータ接続
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const EMULATOR_HOST = 'localhost';
  
  try {
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
  } catch (error) {
    console.log('Auth emulator already connected');
  }
  
  try {
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  } catch (error) {
    console.log('Firestore emulator already connected');
  }
  
  try {
    connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  } catch (error) {
    console.log('Storage emulator already connected');
  }
}

export default app;
