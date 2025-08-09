// 完全にスタティックなカレンダーページ
export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          📅 カレンダー
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🗓️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            カレンダー機能
          </h2>
          <p className="text-gray-600 mb-6">
            予定の管理、滞在期間の設定、クエストの確認ができます。
          </p>
          <p className="text-sm text-gray-500">
            現在開発中です。しばらくお待ちください。
          </p>
        </div>
      </div>
    </div>
  );
}
