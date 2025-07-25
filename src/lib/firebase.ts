import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定（Node.js 18 + Firebase v10対応）
// 一時的にテスト用のプロジェクト設定（動作確認用）
const firebaseConfig = {
  apiKey: "AIzaSyDOCAbC123dEf456GhI789jKl012-MnO34", // テスト用
  authDomain: "demo-project-12345.firebaseapp.com", // テスト用
  projectId: "demo-project-12345", // テスト用
  storageBucket: "demo-project-12345.appspot.com", // テスト用
  messagingSenderId: "123456789012", // テスト用
  appId: "1:123456789012:web:0123456789abcdef", // テスト用
  measurementId: "G-DEMO123456" // テスト用
};

// デバッグ用：値の確認
console.log('Firebase Config Debug (Test Project):', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
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
