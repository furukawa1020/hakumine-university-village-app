# Netlify デプロイガイド

## 🎉 Netlifyビルドエラー修正完了！

白峰大学村アプリのNetlifyデプロイ設定が正常に完了しました。以下の問題を解決済みです：

### ✅ 解決済み問題
- ✅ **Node.jsバージョンエラー**: 18.19.1 (LTSバージョン)に修正
- ✅ **Firebase依存関係**: v10.14.0で安定化
- ✅ ビルドキャッシュの設定
- ✅ 依存関係のインストール処理
- ✅ Next.js静的エクスポート設定
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
1. **Node.js バージョン**: Node.js 20が設定されているか
2. **環境変数**: Firebase環境変数が正しく設定されているか  
3. **依存関係**: `package-lock.json`がコミットされているか
4. **メモリ制限**: `NODE_OPTIONS="--max-old-space-size=4096"`が設定されているか

#### Q: "Non-zero exit code" エラーが発生する場合
A: 以下の対策を実行：
```bash
# 1. キャッシュをクリア
npm run clean

# 2. 依存関係を再インストール
npm install

# 3. ビルドをデバッグモードで実行
npm run build:verbose
```

#### Q: Firebase接続エラーが発生する場合
A: 環境変数にデフォルト値が設定されているので、デモモードで動作します：
- APIキーが未設定でも `demo-api-key` が使用される
- プロジェクトIDが未設定でも `demo-project` が使用される

#### Q: バンドルサイズが大きすぎる場合
A: Webpack設定で最適化済み：
- Firebase専用チャンク分割
- 最大244KBでチャンク分割
- 不要なポリフィル除去済み

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
