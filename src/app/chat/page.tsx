import { Suspense } from 'react';
import ChatPageClient from './ChatPageClient';

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