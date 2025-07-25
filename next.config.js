/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify対応設定
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // 静的生成を強制
  generateBuildId: async () => {
    return 'netlify-build-' + Date.now()
  },

  // ビルドキャッシュ設定（Netlify対応）
  // cacheHandler: process.env.NETLIFY ? undefined : require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // デフォルトの50MBを無効化してディスクキャッシュを使用

  // Firebase設定（静的ビルド対応）
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DEMO',
  },

  // エラー無視設定
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript設定
  typescript: {
    ignoreBuildErrors: true,
  },

  // Netlify専用最適化
  poweredByHeader: false,
  reactStrictMode: false, // Netlifyビルドでの互換性向上

  // ビルド最適化設定（基本設定のみ）
  experimental: {
    forceSwcTransforms: true,
  },

  // 本番環境でのコンソール削除（Netlify対応）
  compiler: process.env.NODE_ENV === 'production' ? {
    removeConsole: {
      exclude: ['error', 'warn']
    },
  } : {},

  // Webpack設定（Netlify対応簡略版）
  webpack: (config, { isServer }) => {
    // サーバーサイドでの Node.js polyfill を無効化
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
