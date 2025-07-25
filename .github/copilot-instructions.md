# 白峰大学村アプリ - Copilot開発指針

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## プロジェクト概要
このプロジェクトは、白峰大学村参加学生向けのPWA（Progressive Web App）です。学生同士の交流促進、活動の可視化、ゆるく楽しい体験の提供を目的としています。

## 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証・DB**: Firebase (Auth, Firestore, Storage, FCM) 
- **PWA**: next-pwa
- **地図**: Leaflet.js
- **状態管理**: Zustand
- **UI**: React Hook Form + Zod

## 主要機能
1. **認証・プロフィール**: 大学メール認証、アバター設定
2. **クエストシステム**: 運営作成タスク、参加・完了報告
3. **カレンダー**: 個人予定・滞在・クエスト統合管理
4. **マップ・位置情報**: アバター表示、プライバシー配慮
5. **日記ログ**: 振り返り投稿、公開範囲設定
6. **チャット**: テキスト・音声メモ・通話機能
7. **PWA対応**: オフライン機能、ホーム画面追加

## コーディング規約
- **コンポーネント**: 機能単位でディレクトリ分割
- **型定義**: `types/`ディレクトリで一元管理
- **スタイル**: Tailwind CSS使用、カスタムCSS最小限
- **バリデーション**: Zodスキーマ使用
- **エラーハンドリング**: try-catch + user-friendly メッセージ
- **アクセシビリティ**: ARIA対応、色覚多様性配慮

## ディレクトリ構成
```
src/
├── app/                 # App Router
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

## UI/UXガイドライン
- **テーマ**: 温かみ・素朴さ・遊び心
- **カラー**: 自然色ベース（白峰の雪・山・自然）
- **操作**: 1画面1目的、3タップ以内でメイン機能到達
- **レスポンシブ**: モバイルファースト設計
- **フィードバック**: 処理中状態・成功・エラー明示

## プライバシー・セキュリティ
- 位置情報は粒度調整・ON/OFF切替
- 公開範囲設定（公開/非公開/限定公開）
- Firebase Rulesで適切なアクセス制御
- 機微情報の暗号化・適切な権限管理

## 開発時の注意点
- PWA要件を満たすmanifest.json・Service Worker
- オフライン対応：キャッシュ・ローカル保存・同期
- 通信環境制約：山間部での不安定な通信を考慮
- 学生・運営の2ロール対応
- 段階的機能導入（MVP → 拡張フェーズ）

このガイドラインに従って、学生が「ゆるく・楽しく・可視化」できる最高のアプリを作りましょう！
