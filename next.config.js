/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify対応設定
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Firebase設定（静的ビルド対応）
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },

  // ESLint設定
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript設定
  typescript: {
    ignoreBuildErrors: true,
  },

  // 実験的機能（必要に応じて）
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig
