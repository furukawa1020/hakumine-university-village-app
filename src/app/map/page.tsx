import dynamic from 'next/dynamic';

// Leafletは クライアントサイドでのみ動作するため、動的インポートを使用
const MapPageClient = dynamic(() => import('./MapPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="animate-pulse text-gray-600">
        マップ機能を読み込んでいます...
      </div>
    </div>
  )
});

export default function MapPage() {
  return <MapPageClient />;
}