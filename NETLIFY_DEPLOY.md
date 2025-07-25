# Netlify デプロイガイド

## 🎉 Netlifyビルドエラー修正完了！

白峰大学村アプリのNetlifyデプロイ設定が正常に完了しました。以下の問題を解決済みです：

### ✅ 解決済み問題
- ✅ ビルドキャッシュの設定
- ✅ 依存関係のインストール処理
- ✅ Next.js静的エクスポート設定
- ✅ Node.js 20 & npm 10 環境設定
- ✅ パッケージロックファイルの整合性

### 📁 設定ファイル一覧

#### 1. `netlify.toml` - Netlify設定
```toml
[build]
  publish = "out"
  command = "npm run build:netlify"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"
  NEXT_CACHE = "true"
  NPM_CONFIG_CACHE = ".npm"
```

#### 2. `next.config.js` - Next.js設定
```javascript
{
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { cpus: 1 },
  compiler: { removeConsole: true }
}
```

#### 3. `.npmrc` - npm設定
```
engine-strict=false
cache=.npm
progress=false
audit=false
```

### 🚀 デプロイ手順

#### 1. GitHubへプッシュ
```bash
git add .
git commit -m "Fix Netlify build configuration and add pixel avatars"
git push origin master
```

#### 2. Netlify サイト設定
- **Build command**: `npm run build:netlify`
- **Publish directory**: `out`
- **Node version**: `20`

#### 3. 環境変数設定（Netlify管理画面）
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 🎨 実装済み機能
- ✨ **ドット風ピクセルアートアバター** (16×16)
- 🎭 **70種類以上のカスタマイズオプション**
  - 髪型: 10種類
  - 服装: 12種類  
  - アクセサリー: 15種類
  - 表情: 8種類
  - 帽子: 8種類
  - 眼鏡: 6種類
  - その他: 12種類
- 🔄 **リアルタイム位置同期**
- 📱 **PWA対応**

### 🔧 トラブルシューティング

#### Q: ビルドが失敗する場合
A: 以下を確認：
1. Node.js 20が設定されているか
2. 環境変数が正しく設定されているか  
3. `package-lock.json`がコミットされているか

#### Q: アバターが表示されない場合
A: Firebase設定を確認：
1. Firestore Rulesが適切に設定されているか
2. 認証が有効化されているか
3. 環境変数が正しいか

### 📊 ビルド結果
```
Route (app)            Size    First Load JS
┌ ○ /                  162 B   103 kB
├ ○ /dashboard         5.09 kB 239 kB
├ ○ /map              6.69 kB 241 kB
└ ○ /quests           5.11 kB 117 kB
```

### 🎯 次のステップ
1. **Firebase本番設定**: `FIREBASE_SETUP.md`を参照
2. **ドメイン設定**: カスタムドメインの設定
3. **アナリティクス**: Google Analytics統合
4. **セキュリティ**: CSPヘッダー設定

---

**🎉 デプロイが成功したら、学生さんたちが可愛いドット風アバターで楽しく交流できる白峰大学村アプリの完成です！**
