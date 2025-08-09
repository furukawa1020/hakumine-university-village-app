import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// クライアントコンポーネントを動的にインポート（SSR無効）
const ChatPageClient = dynamic(() => import('./ChatPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">
        チャット機能を読み込んでいます...
      </div>
    </div>
  )
});

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          チャット機能を読み込んでいます...
        </div>
      </div>
    }>
      <ChatPageClient />
    </Suspense>
  );
}