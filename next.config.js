/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify対応設定
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // ビルドID生成
  generateBuildId: async () => {
    return 'netlify-build-' + Date.now()
  },

  // Firebase設定
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DEMO',
  },

  // エラー無視設定（開発中）
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 基本設定
  poweredByHeader: false,
  reactStrictMode: true,

  // 実験的機能
  experimental: {
    forceSwcTransforms: true,
  },

  // Webpack設定
  webpack: (config, { isServer, dev }) => {
    // パス解決のエイリアス設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // クライアントサイドのfallback設定
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
        child_process: false,
        worker_threads: false,
        perf_hooks: false,
        dns: false,
      }
    }

    // 外部パッケージの設定（Netlify対応）
    config.externals = config.externals || [];
    
    // Leaflet関連のSSR問題を回避
    if (isServer) {
      config.externals.push('leaflet', 'react-leaflet');
    }

    return config
  },

  // 外部パッケージの transpilation 設定
  transpilePackages: ['leaflet', 'react-leaflet'],
}

module.exports = nextConfig;

module.exports = nextConfig;
