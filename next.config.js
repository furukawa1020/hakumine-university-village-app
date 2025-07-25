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

  // ビルド最適化設定
  experimental: {
    esmExternals: true,
    forceSwcTransforms: true,
  },

  // メモリ制限とパフォーマンス
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // 本番環境でのコンソール削除
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  // Webpack設定
  webpack: (config, { isServer }) => {
    // バンドルサイズ最適化
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 244000,
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase/,
            name: 'firebase',
            priority: 10,
            chunks: 'all',
            maxSize: 244000,
          },
        },
      },
    }

    // Firebase関連の外部化とポリフィル
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
