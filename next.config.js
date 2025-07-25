/** @type {import('next').NextConfig} */
// PWA設定（後で有効化）
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// });

const nextConfig = {
  // Netlify対応設定（一時的に静的エクスポートを無効化）
  // output: 'export',
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

  // Webpack設定（Netlify + Firebase対応）
  webpack: (config, { isServer, dev }) => {
    // TypeScriptパス解決のエイリアス設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Firebase関連の最適化（クライアントサイド）
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
        // Firebase関連の追加fallback
        'child_process': false,
        'worker_threads': false,
        'perf_hooks': false,
        'dns': false,
      }
    }

    // Firebase/Node.js関連モジュールの外部化（サーバーサイドビルド時）
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@grpc/grpc-js': 'commonjs @grpc/grpc-js',
        '@grpc/proto-loader': 'commonjs @grpc/proto-loader',
        'firebase-admin': 'commonjs firebase-admin',
        'firebase-functions': 'commonjs firebase-functions',
      });

      // Firebase関連モジュールをバンドルから除外
      config.resolve.alias = {
        ...config.resolve.alias,
        '@firebase/auth': false,
        '@firebase/firestore': false,
        '@firebase/storage': false,
        '@firebase/messaging': false,
      };
    }

    // プロダクションビルドでの最適化
    if (!dev) {
      // Firebase SDKの tree shaking を促進
      config.optimization = config.optimization || {};
      config.optimization.sideEffects = false;
    }

    return config
  },
}

module.exports = nextConfig;
