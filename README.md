# 白峰大学村アプリ

白峰大学村に参加する大学生専用のPWA（Progressive Web App）アプリケーションです。学生同士の交流促進、活動の可視化、「ゆるく・楽しく」学べる体験の提供を目的としています。

## 🏔️ 主な機能

- **🎭 ドット風アバター**: パーツを組み合わせてキャラクター作成、活動に応じて新パーツ解放
- **⚔️ クエストシステム**: 雪かき・薪割りなど地域タスクへの参加・完了報告
- **📅 統合カレンダー**: 個人予定・滞在予定・クエスト参加の一元管理
- **🗺️ マップ・位置共有**: プライバシー配慮の位置情報表示、アバター表示
- **💬 チャット・通話**: テキスト・音声メモ・WebRTC通話機能
- **📔 日記ログ**: 振り返り記録・共有、公開範囲設定

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証・DB**: Firebase (Auth, Firestore, Storage, FCM)
- **PWA**: next-pwa
- **地図**: React Leaflet
- **状態管理**: Zustand
- **フォーム**: React Hook Form + Zod

## 📦 セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/hakumine-university-village-app.git
cd hakumine-university-village-app
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. 環境変数設定

`.env.local`ファイルを作成し、Firebase設定を追加：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 🚀 本番デプロイ

### Vercelでのデプロイ

```bash
npm run build
npm run start
```

または Vercel CLI：

```bash
npx vercel --prod
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクション起動
npm run start

# リントチェック
npm run lint

# 型チェック
npm run type-check
```

## 📁 プロジェクト構成

```
src/
├── app/                 # App Router (Next.js 13+)
│   ├── (auth)/         # 認証関連ページ
│   ├── dashboard/      # メインダッシュボード
│   ├── quest/          # クエスト関連ページ
│   ├── calendar/       # カレンダーページ
│   ├── chat/           # チャットページ
│   └── profile/        # プロフィール関連
├── components/          # 再利用可能コンポーネント
│   ├── ui/             # 基本UIコンポーネント
│   ├── avatar/         # アバター関連
│   ├── quest/          # クエスト関連
│   ├── calendar/       # カレンダー関連
│   ├── chat/           # チャット関連
│   └── map/            # マップ関連
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ・設定
├── stores/             # Zustand状態管理
├── types/              # 型定義
└── utils/              # ヘルパー関数
```

## 🎨 デザインシステム

### カラーパレット

- **プライマリ**: 青系（白峰の空）
- **セカンダリ**: 緑系（白峰の山）
- **アクセント**: 茶系（木材・温かみ）
- **ニュートラル**: グレー系（雪・石）

### フォント

- **日本語**: Hiragino Kaku Gothic ProN, Noto Sans JP
- **英語**: Inter, system-ui

## 🔒 セキュリティ・プライバシー

- Firebase Authによる認証
- Firestore Security Rulesでデータ保護
- 位置情報の粒度調整・ON/OFF設定
- 公開範囲設定（公開/限定公開/非公開）

## 📱 PWA機能

- オフライン対応（Service Worker）
- ホーム画面追加可能
- プッシュ通知対応
- レスポンシブデザイン
- Safe Area対応

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:coverage
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは白峰大学村運営団体が管理する内部プロジェクトです。

## 🆘 サポート

- 開発者向け: [GitHub Issues](https://github.com/your-org/hakumine-university-village-app/issues)
- 学生向け: アプリ内フィードバック機能
- 運営向け: 管理画面お問い合わせフォーム

---

**Made with ❤️ for 白峰大学村コミュニティ**
