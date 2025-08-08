import { Suspense } from 'react';
import ChatPageClient from './ChatPageClient';

// 動的レンダリングを有効化（SSRエラー解決）
export const dynamic = 'force-dynamic';

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