import { Suspense } from 'react';
import QuestListClient from './QuestListClient';

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
