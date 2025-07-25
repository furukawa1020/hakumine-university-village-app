import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, Users, MapPin, Calendar, MessageCircle, BookOpen, Sparkles, Shield, Wifi } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">白峰大学村</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button>新規登録</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                学生専用PWAアプリ
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              学びと交流の
              <span className="text-blue-600 block">デジタル村</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              白峰大学村での滞在・活動・交流を「ゆるく・楽しく・可視化」できる学生専用コミュニティ。
              <br />
              ドット風アバターで白峰の自然を舞台に、新しい学びの体験を始めよう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  アプリを始める
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                詳しく見る
              </Button>
            </div>
          </div>
        </section>

        {/* 機能紹介 */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            主な機能
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>ドット風アバター</CardTitle>
                <CardDescription>
                  パーツを組み合わせて自分だけのアバターを作成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  活動に応じて新しいパーツを解放し、自分らしいキャラクターでマップ上を「うろつき」ましょう
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>クエストシステム</CardTitle>
                <CardDescription>
                  雪かき、薪割りなど地域のタスクに参加
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  運営が提示するクエストに参加し、完了報告で振り返りを共有できます
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>統合カレンダー</CardTitle>
                <CardDescription>
                  個人予定・滞在・クエストを一元管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  自分の予定とクエスト参加予定を統合して表示し、効率的に活動計画を立てられます
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <MapPin className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>マップ・位置共有</CardTitle>
                <CardDescription>
                  プライバシーに配慮した位置情報表示
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  白峰エリア内でアバターを表示し、近くにいる学生と交流のきっかけを作れます
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>チャット・通話</CardTitle>
                <CardDescription>
                  テキスト・音声メモ・通話機能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  全体チャットやクエスト別スレッドで情報共有し、音声通話で深いコミュニケーションも可能
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>日記ログ</CardTitle>
                <CardDescription>
                  振り返りを記録・共有
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  日々の学びや体験を写真付きで記録し、公開範囲を設定して他の学生と共有できます
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PWA特徴 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              PWA対応で快適な体験
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Wifi className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">オフライン対応</h4>
                <p className="text-sm text-gray-600">
                  山間部の不安定な通信環境でも最低限の機能が利用可能
                </p>
              </div>
              <div className="group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Mountain className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">ホーム画面追加</h4>
                <p className="text-sm text-gray-600">
                  スマートフォンのホーム画面に追加してアプリのように利用
                </p>
              </div>
              <div className="group">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">プライバシー保護</h4>
                <p className="text-sm text-gray-600">
                  学生専用クローズドコミュニティで安心して利用可能
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                白峰での学びを始めよう
              </h3>
              <p className="text-lg mb-6 opacity-90">
                学生専用のクローズドコミュニティで安心して交流できます
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  大学メールでサインアップ
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10">
              <Mountain className="h-64 w-64" />
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-6 w-6" />
            <span className="font-semibold">白峰大学村アプリ</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 白峰大学村. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
