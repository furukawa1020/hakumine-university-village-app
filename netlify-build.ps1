# Netlify専用ビルドスクリプト (PowerShell版)

Write-Host "🚀 Starting Netlify build for 白峰大学村アプリ..." -ForegroundColor Green

# Node.jsバージョン確認
Write-Host "📋 Node.js version: $(node --version)" -ForegroundColor Cyan
Write-Host "📋 npm version: $(npm --version)" -ForegroundColor Cyan

# 環境変数確認
Write-Host "📋 Environment variables:" -ForegroundColor Cyan
Write-Host "NODE_ENV: $env:NODE_ENV" -ForegroundColor Yellow
Write-Host "CI: $env:CI" -ForegroundColor Yellow

# キャッシュディレクトリ作成
if (!(Test-Path ".npm")) {
    New-Item -ItemType Directory -Path ".npm" -Force | Out-Null
}

# 依存関係のクリーンインストール
Write-Host "📦 Installing dependencies with npm ci..." -ForegroundColor Blue
npm ci --include=dev --cache .npm

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm ci failed!" -ForegroundColor Red
    exit 1
}

# ビルド実行
Write-Host "🔨 Building Next.js application..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# ビルド結果確認
if (Test-Path "out") {
    Write-Host "✅ Build successful! Output directory 'out' created." -ForegroundColor Green
    Get-ChildItem "out" | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ Build failed! Output directory 'out' not found." -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
