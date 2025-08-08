import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestDetailClient from './QuestDetailClient';

// 動的ルートでの静的生成を無効化
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default function QuestDetailPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/quests">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
      </div>
      
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">クエストを読み込み中...</p>
        </div>
      }>
        <QuestDetailClient questId={params.id} />
      </Suspense>
    </div>
  );
}
