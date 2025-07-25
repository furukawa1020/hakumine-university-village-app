'use client'

import { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // PWAがすでにインストールされているかチェック
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    };

    // beforeinstallpromptイベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // インストール後のイベントをリッスン
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkIfInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWAがインストールされました');
      } else {
        console.log('PWAインストールがキャンセルされました');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('インストール中にエラーが発生しました:', error);
    }
  };

  // インストール済みの場合は何も表示しない
  if (isInstalled) {
    return null;
  }

  // インストール可能でない場合は、手動インストールの案内を表示
  if (!isInstallable) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              📱 アプリとしてインストール
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>iOS (Safari):</strong></p>
              <p className="ml-4">共有ボタン → "ホーム画面に追加"</p>
              <p><strong>Android (Chrome):</strong></p>
              <p className="ml-4">メニュー → "アプリをインストール"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // インストールボタンを表示
  return (
    <div className="mb-6">
      <button
        onClick={handleInstallClick}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
      >
        <Download className="w-5 h-5" />
        <span>📱 白峰大学村アプリをインストール</span>
      </button>
      <p className="text-center text-sm text-gray-600 mt-2">
        ホーム画面からワンタップでアクセス！
      </p>
    </div>
  );
}
