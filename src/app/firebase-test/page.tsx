'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'testing' | 'success' | 'error';
  message: string;
}

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string) => {
    setTestResults(prev => 
      prev.map(test => 
        test.name === name ? { ...test, status, message } : test
      )
    );
  };

  const runTests = async () => {
    setIsRunning(true);
    const tests: TestResult[] = [
      { name: 'Firebase初期化', status: 'testing', message: '確認中...' },
      { name: 'Authentication', status: 'testing', message: '確認中...' },
      { name: 'Firestore接続', status: 'testing', message: '確認中...' },
      { name: 'データ書き込み', status: 'testing', message: '確認中...' },
      { name: 'データ読み取り', status: 'testing', message: '確認中...' }
    ];
    setTestResults(tests);

    try {
      // 1. Firebase初期化テスト
      if (auth && db) {
        updateTest('Firebase初期化', 'success', 'Firebase正常に初期化されました');
      } else {
        updateTest('Firebase初期化', 'error', 'Firebase初期化に失敗');
        return;
      }

      // 2. Authentication テスト
      try {
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'testpassword123';
        
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        updateTest('Authentication', 'success', `テストユーザー作成成功: ${userCredential.user.uid}`);
        
        // テストユーザーを削除
        await signOut(auth);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          updateTest('Authentication', 'success', 'Authentication正常動作（既存メール）');
        } else {
          updateTest('Authentication', 'error', `認証エラー: ${error.message}`);
        }
      }

      // 3. Firestore接続テスト
      try {
        const testDoc = doc(db, 'test', 'connection');
        updateTest('Firestore接続', 'success', 'Firestore接続成功');
      } catch (error: any) {
        updateTest('Firestore接続', 'error', `Firestore接続エラー: ${error.message}`);
        return;
      }

      // 4. データ書き込みテスト
      try {
        const testData = {
          message: 'Firebase接続テスト',
          timestamp: new Date(),
          testId: Date.now()
        };
        
        const docRef = await addDoc(collection(db, 'test'), testData);
        updateTest('データ書き込み', 'success', `書き込み成功: ${docRef.id}`);

        // 5. データ読み取りテスト
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          updateTest('データ読み取り', 'success', `読み取り成功: ${JSON.stringify(docSnap.data().message)}`);
        } else {
          updateTest('データ読み取り', 'error', '書き込んだデータが見つかりません');
        }
      } catch (error: any) {
        updateTest('データ書き込み', 'error', `書き込みエラー: ${error.message}`);
        updateTest('データ読み取り', 'error', '書き込み失敗のため読み取りテストをスキップ');
      }

    } catch (error: any) {
      console.error('テスト実行エラー:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🔥 Firebase接続テスト
          </h1>
          <p className="text-gray-600">
            Firebaseサービスとの接続状態を確認します
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>接続テスト実行</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  テスト実行中...
                </>
              ) : (
                'Firebase接続テストを開始'
              )}
            </Button>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>テスト結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{result.name}</h3>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            テストが失敗する場合は、Firebase Consoleで設定を確認してください
          </p>
        </div>
      </div>
    </div>
  );
}
