import dynamic from 'next/dynamic';

// クライアントコンポーネントを動的にインポート（SSR無効）
const QuestListClient = dynamic(() => import('./QuestListClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">
        クエスト情報を読み込んでいます...
      </div>
    </div>
  )
});

export default function QuestsPage() {
  return <QuestListClient />;
}
