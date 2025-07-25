# Firebase プロジェクト設定ガイド

## 現在の状況
現在、アプリは **デモ用の設定** で動作しています。実際にFirebaseの機能（認証、データベース、位置情報同期等）を使用するには、実際のFirebaseプロジェクトの設定が必要です。

## 技術仕様
- **Firebase SDK**: v10.14.0 (Node.js 18対応)  
- **Node.js**: 18 (Netlify推奨LTSバージョン)
- **Next.js**: 15.4.4 (静的エクスポート対応)
- **TailwindCSS**: v3.4.14 (安定版)
- **PostCSS**: 標準設定（autoprefixer + tailwindcss）

## 本番用 Firebase プロジェクト設定手順

### 1. Firebase プロジェクトの作成
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：`hakumine-university-village`）
4. Google Analytics を有効化（推奨）
5. プロジェクトを作成

### 2. Authentication の設定
1. Firebase Console で「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化：
   - **Email/Password**: 基本認証用
   - **Google**: ソーシャルログイン用
   - **Anonymous**: ゲストアクセス用（オプション）

### 3. Cloud Firestore の設定
1. 「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. **本番モード** で開始（セキュリティルールは後で設定）
4. リージョンを選択（asia-northeast1 推奨）

### 4. Cloud Storage の設定
1. 「Storage」を選択
2. 「始める」をクリック
3. セキュリティルールを設定

### 5. Web アプリの追加
1. プロジェクト設定で「アプリを追加」→「Web」を選択
2. アプリ名を入力
3. Firebase Hosting も設定を有効化
4. **設定オブジェクト** をコピー

### 6. 環境変数の更新
`.env.local` ファイルを以下の実際の値で更新：

```bash
# 実際のFirebase設定値に置き換えてください
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 7. Firestore セキュリティルールの設定
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー位置情報
    match /userPositions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // 他ユーザーの位置も読み取り可能
    }
    
    // クエスト情報
    match /quests/{questId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // チャット情報
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    
    // ユーザープロファイル
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
  }
}
```

### 8. Storage セキュリティルールの設定
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 画像アップロード
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
    
    // アバター画像
    match /avatars/{userId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## セキュリティの注意点

### 1. API キーの保護
- 本番環境では適切な API キー制限を設定
- Webhook URL や IP アドレス制限を活用
- 不正使用監視を有効化

### 2. 認証設定
- 強力なパスワードポリシーを設定
- メール認証を必須に設定
- 不正ログイン試行の制限

### 3. データベースルール
- 最小権限の原則を適用
- 機密データへのアクセス制限
- データ検証ルールを実装

## テスト環境での確認事項
- [ ] ユーザー登録・ログインが正常に動作
- [ ] アバター位置がリアルタイムで同期される
- [ ] クエスト作成・参加機能が動作
- [ ] チャット機能が正常に動作
- [ ] 画像アップロードが正常に動作

---

**重要**: デモ環境から本番環境への移行時は、必ずテスト環境で十分な検証を行ってください。
