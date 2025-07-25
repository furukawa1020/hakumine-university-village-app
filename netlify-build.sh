#!/bin/bash

# Netlify専用ビルドスクリプト

echo "🚀 Starting Netlify build for 白峰大学村アプリ..."

# Node.jsバージョン確認
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# 環境変数確認
echo "📋 Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "CI: $CI"
echo "NETLIFY: $NETLIFY"

# キャッシュディレクトリ作成
mkdir -p .npm

# package-lock.jsonの存在確認
if [ ! -f "package-lock.json" ]; then
    echo "📦 package-lock.json not found, generating..."
    npm install --package-lock-only
fi

# 依存関係のインストール
echo "📦 Installing dependencies..."
if [ -f "package-lock.json" ]; then
    echo "Using npm ci for clean install..."
    npm ci --include=dev --cache .npm
else
    echo "Using npm install as fallback..."
    npm install --cache .npm
fi

# ビルド実行
echo "🔨 Building Next.js application..."
npm run build

# ビルド結果確認
if [ -d "out" ]; then
    echo "✅ Build successful! Output directory 'out' created."
    ls -la out/
else
    echo "❌ Build failed! Output directory 'out' not found."
    exit 1
fi

echo "🎉 Netlify build completed successfully!"
