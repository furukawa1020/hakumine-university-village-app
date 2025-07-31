import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PWAInstallButton } from "@/components/ui/PWAInstallButton";
import { AuthInitializer } from "@/components/AuthInitializer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  title: "白峰大学村アプリ",
  description: "白峰大学村参加学生向けコミュニティアプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "白峰大学村アプリ"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="白峰大学村" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' })
                      .then(function(registration) {
                        console.log('✅ Service Worker registered successfully:', registration);
                        console.log('Scope:', registration.scope);
                        
                        // アップデートをチェック
                        registration.addEventListener('updatefound', () => {
                          console.log('🔄 Service Worker update found');
                        });
                      })
                      .catch(function(registrationError) {
                        console.error('❌ Service Worker registration failed:', registrationError);
                      });
                  });
                } else {
                  console.log('❌ Service Worker not supported');
                }

                // PWA インストール関連のデバッグ
                window.addEventListener('beforeinstallprompt', (e) => {
                  console.log('✅ PWA Install prompt ready');
                  e.preventDefault();
                  window.deferredPrompt = e;
                });

                window.addEventListener('appinstalled', (evt) => {
                  console.log('✅ PWA was installed successfully');
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-white text-gray-900`}
      >
        <AuthInitializer>
          {children}
        </AuthInitializer>
        <PWAInstallButton />
      </body>
    </html>
  );
}
