import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定（Node.js 18 + Firebase v10対応）
// 一時的にハードコード（テスト用）
const firebaseConfig = {
  apiKey: "AIzaSyAEq7IxIneu-SA6-d-xdCZC2OU8cArJr84",
  authDomain: "hakumine-university-village.firebaseapp.com",
  projectId: "hakumine-university-village",
  storageBucket: "hakumine-university-village.firebasestorage.app",
  messagingSenderId: "710646321611",
  appId: "1:710646321611:web:e3e1d018fe07504da1664e",
  measurementId: "G-GJYCPZV15W"
};

// デバッグ用：値の確認
console.log('Firebase Config Debug (Hardcoded Test):', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  appId: firebaseConfig.appId.substring(0, 30) + '...',
  measurementId: firebaseConfig.measurementId
});

// Firebase初期化（エラーハンドリング付き）
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  
  // Services初期化（Node.js 18互換）
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Netlifyビルド時のフォールバック
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };

// Messaging（Netlifyビルド互換性のため無効化）
export const messaging = null;

export default app;
