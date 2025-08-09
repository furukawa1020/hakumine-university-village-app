import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// 静的エクスポート用のパラメータ生成 - Netlify対応
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // 静的エクスポートではクライアントサイドルーティングを使用
  // 空の配列を返すことで、すべての動的ルートをクライアントサイドで処理
  return [];
}

// 動的パラメータを許可
export const dynamicParams = true;

// 型定義を明示的に追加
export type Params = {
  id: string;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface PageProps {
  params: { id: string };
}

// クライアントコンポーネントを動的にインポート（SSR無効）
const QuestDetailClient = dynamic(() => import('./QuestDetailClient'), {
  ssr: false,
  loading: () => (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">クエストを読み込み中...</p>
    </div>
  )
});

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
