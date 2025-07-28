'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Download, Smartphone, X, CheckCircle } from 'lucide-react'

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
  const [isInstalling, setIsInstalling] = useState(false)
  const [installResult, setInstallResult] = useState<'success' | 'failed' | null>(null)

  useEffect(() => {
    // PWAがすでにインストールされているかチェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isWebKit = 'standalone' in window.navigator && (window.navigator as any).standalone
    
    console.log('PWA Status Check:', { isStandalone, isWebKit })
    
    if (isStandalone || isWebKit) {
      setIsInstalled(true)
      console.log('✅ PWA already installed')
      return
    }

    // iOSデバイスの検出
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)
    console.log('Device Detection:', { iOS })

    // beforeinstallpromptイベントのリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
    }

    // appinstalledイベントのリスナー
    const handleAppInstalled = () => {
      console.log('✅ App installed successfully')
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
      setInstallResult('success')
      
      // 成功メッセージを3秒後に非表示
      setTimeout(() => setInstallResult(null), 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // iOSでも手動インストール案内を表示
    if (iOS && !isStandalone && !isWebKit) {
      setShowInstallBanner(true)
    }

    // クリーンアップ
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('❌ No deferred prompt available')
      return
    }

    setIsInstalling(true)
    console.log('🚀 Starting PWA installation...')

    try {
      await deferredPrompt.prompt()
      console.log('✅ Install prompt shown')
      
      const { outcome } = await deferredPrompt.userChoice
      console.log('User choice:', outcome)

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
        setInstallResult('success')
      } else {
        console.log('❌ User dismissed the install prompt')
        setInstallResult('failed')
      }

      setDeferredPrompt(null)
      setShowInstallBanner(false)
      
      // 結果メッセージを3秒後に非表示
      setTimeout(() => setInstallResult(null), 3000)
      
    } catch (error) {
      console.error('❌ Install prompt failed:', error)
      setInstallResult('failed')
      setTimeout(() => setInstallResult(null), 3000)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
  }

  // インストール結果メッセージ
  if (installResult) {
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        installResult === 'success' 
          ? 'bg-green-100 border border-green-200 text-green-800' 
          : 'bg-red-100 border border-red-200 text-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {installResult === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span className="font-medium">
            {installResult === 'success' 
              ? 'アプリのインストールが完了しました！' 
              : 'インストールに失敗しました。'}
          </span>
        </div>
      </div>
    )
  }

  // すでにインストール済みまたはバナーを表示しない場合
  if (isInstalled || !showInstallBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">
              📱 アプリをインストール
            </h3>
            
            {isIOS ? (
              <div className="text-sm text-gray-600 mb-3">
                <p className="mb-2">Safariで以下の手順でインストールできます：</p>
                <ol className="text-xs space-y-1 pl-4 list-decimal">
                  <li>下部の「共有」ボタンをタップ</li>
                  <li>「ホーム画面に追加」を選択</li>
                  <li>「追加」をタップ</li>
                </ol>
              </div>
            ) : deferredPrompt ? (
              <p className="text-sm text-gray-600 mb-3">
                ホーム画面に追加してより便利にご利用いただけます
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                このブラウザではPWAインストールがサポートされていません
              </p>
            )}
            
            <div className="flex gap-2">
              {deferredPrompt && (
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isInstalling}
                >
                  {isInstalling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      インストール中...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      インストール
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="text-gray-600"
              >
                後で
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="flex-shrink-0 w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
