'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Download, Smartphone, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // PWAがすでにインストールされているかチェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isWebKit = 'standalone' in window.navigator && (window.navigator as any).standalone
    
    if (isStandalone || isWebKit) {
      setIsInstalled(true)
      return
    }

    // iOSデバイスの検出
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // beforeinstallpromptイベントのリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
    }

    // appinstalledイベントのリスナー
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // iOSの場合、少し遅れて表示
    if (iOS && !isStandalone && !isWebKit) {
      setTimeout(() => setShowInstallBanner(true), 2000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('ユーザーがPWAのインストールを受け入れました')
      } else {
        console.log('ユーザーがPWAのインストールを却下しました')
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    } catch (error) {
      console.error('インストールプロンプトでエラーが発生しました:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    // 一定時間後に再表示するためのローカルストレージ管理
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // インストール済みまたは表示しない場合は何も表示しない
  if (isInstalled || !showInstallBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                白峰大学村アプリをインストール
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {isIOS 
                  ? 'ホーム画面に追加してアプリとして使用できます'
                  : 'ホーム画面に追加して快適に利用しましょう'
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-4 flex space-x-2">
          {isIOS ? (
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-2">
                📲 Safariの共有ボタン → 「ホーム画面に追加」をタップ
              </div>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                了解しました
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                後で
              </Button>
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-1" />
                インストール
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// アニメーション用のCSS（globals.cssに追加）
// @keyframes slide-up {
//   from {
//     transform: translateY(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
// .animate-slide-up {
//   animation: slide-up 0.3s ease-out;
// }
