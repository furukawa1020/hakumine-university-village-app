import { Suspense } from 'react';
import QuestListClient from './QuestListClient';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function QuestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          クエスト情報を読み込んでいます...
        </div>
      </div>
    }>
      <QuestListClient />
    </Suspense>
  );
}
