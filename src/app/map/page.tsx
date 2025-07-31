'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Users, 
  Eye, 
  EyeOff, 
  Settings,
  ArrowLeft,
  Navigation,
  Wifi,
  WifiOff,
  AlertCircle,
  Home,
  Calendar,
  MessageCircle,
  BookOpen,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

// 白峰エリアの座標（石川県白山市白峰）
const HAKUMINE_CENTER = [36.2547, 136.6342];

// 地図の境界（白峰村エリア）
const MAP_BOUNDS = {
  north: 36.270,  // 北端
  south: 36.240,  // 南端
  east: 136.650,  // 東端
  west: 136.620   // 西端
};

// 座標を地図上のピクセル位置に変換
const latLngToPixel = (lat: number, lng: number) => {
  const x = ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 1000;
  const y = ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 700;
  return { x: Math.max(0, Math.min(1000, x)), y: Math.max(0, Math.min(700, y)) };
};

// 位置情報追跡
let watchId: number | null = null;

export default function MapPage() {
  const { user } = useAuthStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [onlineUsers] = useState<any[]>([]); // 実際のユーザーデータは今後Firebase等から取得
  const [isLoading, setIsLoading] = useState(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // 位置情報追跡関数をコンポーネント内に移動
  const startLocationTracking = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1分
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('位置情報更新:', { latitude, longitude, accuracy });
        
        // 状態を更新（リアルタイム追跡）
        setUserLocation([latitude, longitude]);
        setGpsAccuracy(accuracy);
        
        // 精度情報も更新
        if (accuracy && accuracy < 50) {
          console.log('高精度GPS取得:', accuracy + 'm');
        }
      },
      (error) => {
        console.error('位置情報追跡エラー:', error);
        // エラー時も継続して追跡を試行
      },
      options
    );

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };
  };

  useEffect(() => {
    // ブラウザ環境でのみ位置情報を取得
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    // 位置情報の取得（強化版）
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000, // 15秒のタイムアウト
          maximumAge: 300000 // 5分のキャッシュ
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log('位置情報取得成功:', { latitude, longitude, accuracy });
            setUserLocation([latitude, longitude]);
            setGpsAccuracy(accuracy);
            setLocationPermission('granted');
            setIsLoading(false);
          },
          (error) => {
            console.error('位置情報取得エラー:', error);
            console.log('白峰地域のデフォルト位置を使用します');
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER as [number, number]);
            setIsLoading(false);
          },
          options
        );
      } else {
        console.log('Geolocation APIが利用できません');
        setLocationPermission('denied');
        setUserLocation(HAKUMINE_CENTER as [number, number]);
        setIsLoading(false);
      }
    };

    // 位置情報許可状態をチェック
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('位置情報許可状態:', result.state);
        if (result.state === 'granted') {
          getCurrentLocation();
        } else if (result.state === 'denied') {
          setLocationPermission('denied');
          setUserLocation(HAKUMINE_CENTER as [number, number]);
          setIsLoading(false);
        } else {
          getCurrentLocation();
        }
      }).catch(() => {
        // permissions API が利用できない場合は直接取得を試行
        getCurrentLocation();
      });
    } else {
      getCurrentLocation();
    }
  }, []);

  const toggleLocationSharing = () => {
    const newSharingState = !locationSharing;
    setLocationSharing(newSharingState);
    
    if (newSharingState && locationPermission === 'granted') {
      // 位置情報共有を有効にした場合、リアルタイム追跡を開始
      startLocationTracking();
      console.log('位置情報共有を有効にしました');
    } else {
      console.log('位置情報共有を無効にしました');
    }
    
    // ここで実際の位置情報共有設定をFirebaseに保存する処理を追加予定
  };

  // 位置情報が取得できた場合の自動追跡開始
  useEffect(() => {
    if (locationPermission === 'granted' && locationSharing) {
      const cleanup = startLocationTracking();
      return cleanup;
    }
  }, [locationPermission, locationSharing]);

  const requestLocationPermission = () => {
    if (typeof window === 'undefined') return;
    
    const getCurrentLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setLocationPermission('granted');
            console.log('位置情報許可が得られました:', { latitude, longitude });
          },
          (error) => {
            console.error('位置情報取得失敗:', error);
            setLocationPermission('denied');
            setUserLocation(HAKUMINE_CENTER as [number, number]);
          },
          options
        );
      }
    };

    getCurrentLocation();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">位置情報を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">白峰村マップ</h1>
        </div>
        <Link href="/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </Link>
      </div>

      {/* 位置情報ステータス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>位置情報</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {locationPermission === 'granted' ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {locationPermission === 'granted' ? '位置情報取得中' : '位置情報が利用できません'}
              </span>
            </div>
            {locationPermission === 'denied' && (
              <Button onClick={requestLocationPermission} size="sm">
                許可を求める
              </Button>
            )}
          </div>
          
          {userLocation && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">現在位置</p>
              <p className="text-xs text-gray-600">
                緯度: {userLocation[0].toFixed(6)}<br />
                経度: {userLocation[1].toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm">位置情報を他の人と共有</span>
            <Button
              onClick={toggleLocationSharing}
              variant={locationSharing ? "default" : "outline"}
              size="sm"
              disabled={locationPermission !== 'granted'}
            >
              {locationSharing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  共有中
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  非共有
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* マップ表示エリア */}
      <Card>
        <CardHeader>
          <CardTitle>村の地図</CardTitle>
          <CardDescription>
            白峰大学村の地図です。あなたの位置と他の学生の位置が表示されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-white rounded-lg min-h-[700px] overflow-hidden border border-gray-300 shadow-2xl">
            {/* 超高品質地図背景 - Googleマップスタイル */}
            <div className="absolute inset-0">
              {/* 地形の超詳細レイヤー */}
              <svg viewBox="0 0 1000 700" className="w-full h-full">
                <defs>
                  {/* 建物の影効果 */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
                  </filter>
                  
                  {/* 道路のパターン */}
                  <pattern id="asphalt" patternUnits="userSpaceOnUse" width="4" height="4">
                    <rect width="4" height="4" fill="#4a4a4a"/>
                    <circle cx="1" cy="1" r="0.3" fill="#5a5a5a"/>
                    <circle cx="3" cy="3" r="0.3" fill="#5a5a5a"/>
                  </pattern>
                  
                  {/* 草地のパターン */}
                  <pattern id="grass" patternUnits="userSpaceOnUse" width="8" height="8">
                    <rect width="8" height="8" fill="#7fb069"/>
                    <path d="M1,6 Q2,4 3,6 Q4,4 5,6" stroke="#6b8e5a" strokeWidth="0.5" fill="none"/>
                    <path d="M3,2 Q4,0 5,2 Q6,0 7,2" stroke="#6b8e5a" strokeWidth="0.5" fill="none"/>
                  </pattern>
                  
                  {/* 水の波紋効果 */}
                  <pattern id="water" patternUnits="userSpaceOnUse" width="20" height="10">
                    <rect width="20" height="10" fill="#4a9eff"/>
                    <path d="M0,5 Q5,3 10,5 T20,5" stroke="#3d8bdb" strokeWidth="0.8" fill="none" opacity="0.6"/>
                    <path d="M0,7 Q5,5 10,7 T20,7" stroke="#6bb6ff" strokeWidth="0.5" fill="none" opacity="0.4"/>
                  </pattern>
                </defs>
                
                {/* 基本地面 - 自然な色合い */}
                <rect width="1000" height="700" fill="#f4f5f0"/>
                
                {/* 地形の詳細な層構造 */}
                <g id="terrain">
                  {/* 遠山の層 */}
                  <polygon points="0,350 120,180 280,220 450,160 620,200 800,170 1000,160 1000,700 0,700" fill="#c8d5b9" opacity="0.8"/>
                  <polygon points="100,450 220,280 380,320 550,260 720,300 900,270 1000,260 1000,700 100,700" fill="#b8c7a9" opacity="0.9"/>
                  <polygon points="200,550 320,380 480,420 650,360 820,400 1000,380 1000,700 200,700" fill="#a8b799"/>
                  
                  {/* 近景の丘陵 */}
                  <polygon points="0,500 150,420 300,450 450,400 600,440 750,410 900,450 1000,430 1000,700 0,700" fill="#9cb088"/>
                  <polygon points="50,600 200,520 350,550 500,500 650,540 800,510 950,550 1000,530 1000,700 50,700" fill="#8ca078"/>
                </g>
                
                {/* 詳細な森林エリア */}
                <g id="forest">
                  {/* 大きな森林ブロック */}
                  <ellipse cx="200" cy="300" rx="80" ry="60" fill="url(#grass)" opacity="0.9"/>
                  <ellipse cx="600" cy="250" rx="100" ry="70" fill="url(#grass)" opacity="0.9"/>
                  <ellipse cx="800" cy="400" rx="90" ry="65" fill="url(#grass)" opacity="0.9"/>
                  
                  {/* 個別の木々 - より現実的な配置 */}
                  {Array.from({ length: 200 }, (_, i) => {
                    const clusters = [
                      { centerX: 200, centerY: 300, radius: 80 },
                      { centerX: 600, centerY: 250, radius: 100 },
                      { centerX: 800, centerY: 400, radius: 90 },
                      { centerX: 150, centerY: 500, radius: 60 },
                      { centerX: 750, centerY: 350, radius: 70 }
                    ];
                    const cluster = clusters[i % clusters.length];
                    const angle = (i / clusters.length) * 2 * Math.PI + Math.random() * Math.PI;
                    const distance = Math.random() * cluster.radius;
                    const x = cluster.centerX + Math.cos(angle) * distance;
                    const y = cluster.centerY + Math.sin(angle) * distance;
                    const size = 3 + Math.random() * 8;
                    const treeType = Math.random();
                    
                    if (treeType < 0.6) {
                      // 針葉樹
                      return (
                        <g key={`tree-${i}`}>
                          <polygon points={`${x},${y} ${x-size/2},${y+size} ${x+size/2},${y+size}`} fill="#2d5016"/>
                          <polygon points={`${x},${y-size/3} ${x-size/3},${y+size/2} ${x+size/3},${y+size/2}`} fill="#3d6026"/>
                          <rect x={x-1} y={y+size-2} width="2" height="4" fill="#654321"/>
                        </g>
                      );
                    } else {
                      // 広葉樹
                      return (
                        <g key={`tree-${i}`}>
                          <circle cx={x} cy={y} r={size} fill="#228b22" opacity="0.9"/>
                          <circle cx={x-size/3} cy={y-size/4} r={size*0.7} fill="#32cd32" opacity="0.7"/>
                          <circle cx={x+size/4} cy={y-size/3} r={size*0.6} fill="#90ee90" opacity="0.6"/>
                          <rect x={x-1.5} y={y+size-3} width="3" height="6" fill="#8b4513"/>
                        </g>
                      );
                    }
                  })}
                </g>
                
                {/* 川・水系システム */}
                <g id="waterways">
                  {/* メイン河川 */}
                  <path d="M0,320 Q150,310 300,330 Q450,350 600,340 Q750,330 900,350 L1000,345" 
                        fill="url(#water)" stroke="none" strokeWidth="20"/>
                  <path d="M0,320 Q150,310 300,330 Q450,350 600,340 Q750,330 900,350 L1000,345" 
                        stroke="#2e86ab" strokeWidth="16" fill="none" opacity="0.8"/>
                  <path d="M0,320 Q150,310 300,330 Q450,350 600,340 Q750,330 900,350 L1000,345" 
                        stroke="#a8dadc" strokeWidth="8" fill="none" opacity="0.6"/>
                  
                  {/* 支流 */}
                  <path d="M200,280 Q250,290 300,300 Q350,310 400,320" 
                        stroke="#4a9eff" strokeWidth="8" fill="none" opacity="0.7"/>
                  <path d="M500,380 Q550,370 600,380 Q650,390 700,380" 
                        stroke="#4a9eff" strokeWidth="6" fill="none" opacity="0.7"/>
                  
                  {/* 小川 */}
                  <path d="M150,450 Q200,440 250,450 Q300,460 350,450" 
                        stroke="#87ceeb" strokeWidth="3" fill="none" opacity="0.8"/>
                  <path d="M600,500 Q650,490 700,500 Q750,510 800,500" 
                        stroke="#87ceeb" strokeWidth="3" fill="none" opacity="0.8"/>
                </g>
                
                {/* 高速道路・主要道路システム */}
                <g id="highways">
                  {/* 高速道路 */}
                  <path d="M0,420 Q200,410 400,420 Q600,430 800,420 L1000,415" 
                        stroke="#2c2c2c" strokeWidth="20" fill="none"/>
                  <path d="M0,420 Q200,410 400,420 Q600,430 800,420 L1000,415" 
                        stroke="url(#asphalt)" strokeWidth="16" fill="none"/>
                  <path d="M0,420 Q200,410 400,420 Q600,430 800,420 L1000,415" 
                        stroke="#ffffff" strokeWidth="3" fill="none" strokeDasharray="15,10"/>
                  
                  {/* 縦の主要道路 */}
                  <path d="M250,0 Q270,150 290,300 Q310,450 330,600 L340,700" 
                        stroke="#2c2c2c" strokeWidth="16" fill="none"/>
                  <path d="M250,0 Q270,150 290,300 Q310,450 330,600 L340,700" 
                        stroke="url(#asphalt)" strokeWidth="12" fill="none"/>
                  <path d="M250,0 Q270,150 290,300 Q310,450 330,600 L340,700" 
                        stroke="#ffffff" strokeWidth="2" fill="none" strokeDasharray="10,8"/>
                  
                  <path d="M600,0 Q620,150 640,300 Q660,450 680,600 L690,700" 
                        stroke="#2c2c2c" strokeWidth="16" fill="none"/>
                  <path d="M600,0 Q620,150 640,300 Q660,450 680,600 L690,700" 
                        stroke="url(#asphalt)" strokeWidth="12" fill="none"/>
                  <path d="M600,0 Q620,150 640,300 Q660,450 680,600 L690,700" 
                        stroke="#ffffff" strokeWidth="2" fill="none" strokeDasharray="10,8"/>
                </g>
                
                {/* 詳細な建物群 */}
                <g id="buildings" filter="url(#shadow)">
                  {/* 白峰研修センター - 大型複合建築 */}
                  <g id="research-center">
                    <rect x="180" y="250" width="120" height="80" fill="#dc3545" stroke="#8b0000" strokeWidth="2"/>
                    <rect x="190" y="240" width="100" height="12" fill="#8b0000"/>
                    <rect x="200" y="270" width="20" height="30" fill="#654321"/>
                    <rect x="230" y="270" width="25" height="20" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="265" y="270" width="25" height="20" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="240" y="300" width="15" height="12" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="270" y="300" width="15" height="12" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <text x="240" y="285" fontSize="8" fill="#ffffff" fontWeight="bold">研修センター</text>
                  </g>
                  
                  {/* 食堂 - モダンな建物 */}
                  <g id="cafeteria">
                    <rect x="580" y="180" width="80" height="60" fill="#007bff" stroke="#0056b3" strokeWidth="2"/>
                    <rect x="590" y="170" width="60" height="10" fill="#0056b3"/>
                    <rect x="600" y="200" width="15" height="20" fill="#654321"/>
                    <rect x="625" y="200" width="12" height="12" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="645" y="200" width="12" height="12" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="605" y="220" width="8" height="8" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="620" y="220" width="8" height="8" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="635" y="220" width="8" height="8" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <text x="610" y="210" fontSize="6" fill="#ffffff" fontWeight="bold">食堂</text>
                  </g>
                  
                  {/* 図書館 - 学術的な建物 */}
                  <g id="library">
                    <rect x="300" y="450" width="100" height="70" fill="#28a745" stroke="#1e7e34" strokeWidth="2"/>
                    <rect x="310" y="440" width="80" height="10" fill="#1e7e34"/>
                    <rect x="320" y="470" width="18" height="25" fill="#654321"/>
                    <rect x="350" y="470" width="15" height="15" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="375" y="470" width="15" height="15" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="350" y="495" width="15" height="15" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="375" y="495" width="15" height="15" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <text x="330" y="485" fontSize="6" fill="#ffffff" fontWeight="bold">図書館</text>
                  </g>
                  
                  {/* 体育館 - 大型アリーナ */}
                  <g id="gymnasium">
                    <rect x="700" y="300" width="140" height="90" fill="#ffc107" stroke="#e0a800" strokeWidth="2"/>
                    <rect x="710" y="290" width="120" height="10" fill="#e0a800"/>
                    <rect x="730" y="330" width="20" height="30" fill="#654321"/>
                    <rect x="760" y="330" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="790" y="330" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="820" y="330" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="760" y="360" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="790" y="360" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <rect x="820" y="360" width="18" height="18" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
                    <text x="750" y="350" fontSize="8" fill="#000000" fontWeight="bold">体育館</text>
                  </g>
                  
                  {/* 宿舎群 - 統一されたデザイン */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const x = 100 + col * 80;
                    const y = 550 + row * 50;
                    return (
                      <g key={`dorm-${i}`}>
                        <rect x={x} y={y} width="60" height="40" fill="#9370db" stroke="#663399" strokeWidth="1"/>
                        <rect x={x + 10} y={y - 8} width="40" height="8" fill="#663399"/>
                        <rect x={x + 20} y={y + 10} width="12" height="15" fill="#654321"/>
                        <rect x={x + 40} y={y + 10} width="8" height="8" fill="#87ceeb" stroke="#4682b4" strokeWidth="0.5"/>
                        <rect x={x + 40} y={y + 20} width="8" height="8" fill="#87ceeb" stroke="#4682b4" strokeWidth="0.5"/>
                        <rect x={x + 10} y={y + 10} width="6" height="6" fill="#87ceeb" stroke="#4682b4" strokeWidth="0.5"/>
                        <rect x={x + 10} y={y + 20} width="6" height="6" fill="#87ceeb" stroke="#4682b4" strokeWidth="0.5"/>
                        <text x={x + 25} y={y + 20} fontSize="5" fill="#ffffff" fontWeight="bold">宿舎{i + 1}</text>
                      </g>
                    );
                  })}
                </g>
                
                {/* 精密グリッド（Google Maps風） */}
                <g id="grid" opacity="0.15">
                  {Array.from({ length: 21 }, (_, i) => (
                    <g key={`major-grid-${i}`}>
                      <line x1={i * 50} y1="0" x2={i * 50} y2="700" stroke="#000000" strokeWidth="0.8"/>
                      <line x1="0" y1={i * 35} x2="1000" y2={i * 35} stroke="#000000" strokeWidth="0.8"/>
                    </g>
                  ))}
                  {Array.from({ length: 41 }, (_, i) => (
                    <g key={`minor-grid-${i}`}>
                      <line x1={i * 25} y1="0" x2={i * 25} y2="700" stroke="#666666" strokeWidth="0.3"/>
                      <line x1="0" y1={i * 17.5} x2="1000" y2={i * 17.5} stroke="#666666" strokeWidth="0.3"/>
                    </g>
                  ))}
                </g>
                
                {/* 等高線（詳細） */}
                <g id="contours" opacity="0.4">
                  <path d="M50,250 Q200,240 350,250 Q500,260 650,250 Q800,240 950,250" 
                        stroke="#8b4513" strokeWidth="1.5" fill="none"/>
                  <path d="M80,200 Q230,190 380,200 Q530,210 680,200 Q830,190 980,200" 
                        stroke="#8b4513" strokeWidth="1.5" fill="none"/>
                  <path d="M120,150 Q270,140 420,150 Q570,160 720,150 Q870,140 1000,150" 
                        stroke="#8b4513" strokeWidth="1.5" fill="none"/>
                  <path d="M20,300 Q170,290 320,300 Q470,310 620,300 Q770,290 920,300" 
                        stroke="#8b4513" strokeWidth="1" fill="none"/>
                  <path d="M60,350 Q210,340 360,350 Q510,360 660,350 Q810,340 960,350" 
                        stroke="#8b4513" strokeWidth="1" fill="none"/>
                </g>
                
                {/* 道路標識・交通システム */}
                <g id="road-signs">
                  {/* 信号機 */}
                  <rect x="290" y="400" width="4" height="15" fill="#333"/>
                  <circle cx="292" cy="405" r="2" fill="#ff0000"/>
                  <circle cx="292" cy="409" r="2" fill="#ffff00"/>
                  <circle cx="292" cy="413" r="2" fill="#00ff00"/>
                  
                  <rect x="640" y="400" width="4" height="15" fill="#333"/>
                  <circle cx="642" cy="405" r="2" fill="#ff0000"/>
                  <circle cx="642" cy="409" r="2" fill="#ffff00"/>
                  <circle cx="642" cy="413" r="2" fill="#00ff00"/>
                  
                  {/* 道路標識 */}
                  <rect x="200" y="380" width="20" height="15" fill="#ffffff" stroke="#000" strokeWidth="1"/>
                  <text x="210" y="390" fontSize="4" fill="#000" textAnchor="middle">白峰村</text>
                  
                  <rect x="500" y="360" width="25" height="12" fill="#009900" stroke="#000" strokeWidth="1"/>
                  <text x="512" y="368" fontSize="4" fill="#ffffff" textAnchor="middle">研修センター</text>
                </g>
                
                {/* パーキングエリア */}
                <g id="parking">
                  <rect x="320" y="280" width="40" height="30" fill="#cccccc" stroke="#999" strokeWidth="1"/>
                  <text x="340" y="300" fontSize="6" fill="#000" textAnchor="middle">P</text>
                  {Array.from({ length: 8 }, (_, i) => (
                    <rect key={`parking-${i}`} x={325 + (i % 4) * 8} y={285 + Math.floor(i / 4) * 10} 
                          width="6" height="8" fill="none" stroke="#999" strokeWidth="0.5"/>
                  ))}
                </g>
              </svg>
              
              {/* 自分の位置マーカー（実際の座標位置に表示） */}
              {userLocation && (
                (() => {
                  const pixelPos = latLngToPixel(userLocation[0], userLocation[1]);
                  return (
                    <div 
                      className="absolute w-12 h-12 z-30"
                      style={{
                        left: `${pixelPos.x}px`,
                        top: `${pixelPos.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
                          <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
                        </div>
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap font-medium shadow-xl border border-blue-500">
                          📍 あなたの現在位置
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
                        </div>
                        {/* GPS精度の複数円 */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-blue-400 rounded-full opacity-20 animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-blue-300 rounded-full opacity-10 animate-pulse"></div>
                        
                        {/* 現在地の詳細情報（ホバー時表示） */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-xl border border-gray-200 text-xs opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          <div className="text-gray-700">
                            <div>緯度: {userLocation[0].toFixed(6)}</div>
                            <div>経度: {userLocation[1].toFixed(6)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
              
              {/* 他のユーザー（実際の座標位置に表示） */}
              {(() => {
                // サンプルユーザーの座標
                const sampleUsers = [
                  { name: '田中さん', lat: 36.2557, lng: 136.6352, color: 'purple' },
                  { name: '佐藤さん', lat: 36.2537, lng: 136.6332, color: 'orange' }
                ];
                
                return sampleUsers.map((sampleUser, index) => {
                  const pixelPos = latLngToPixel(sampleUser.lat, sampleUser.lng);
                  return (
                    <div 
                      key={`user-${index}`}
                      className="absolute w-10 h-10 z-20"
                      style={{
                        left: `${pixelPos.x}px`,
                        top: `${pixelPos.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className={`w-10 h-10 bg-${sampleUser.color}-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">{sampleUser.name.charAt(0)}</span>
                        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs bg-${sampleUser.color}-500 text-white px-2 py-1 rounded-lg shadow-lg`}>
                          {sampleUser.name}
                          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-${sampleUser.color}-500`}></div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            
            {/* 地図コントロール（Googleマップ風） */}
            <div className="absolute top-4 right-4 space-y-1 z-40">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-10 h-10 p-0 rounded-none border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    if (userLocation) {
                      const pixelPos = latLngToPixel(userLocation[0], userLocation[1]);
                      console.log('現在位置に移動:', pixelPos);
                      // スムーズスクロールで現在位置を中央に移動
                      const mapElement = document.querySelector('[viewBox="0 0 1000 700"]')?.parentElement;
                      if (mapElement) {
                        const containerRect = mapElement.getBoundingClientRect();
                        const scrollX = pixelPos.x - containerRect.width / 2;
                        const scrollY = pixelPos.y - containerRect.height / 2;
                        mapElement.scrollTo({
                          left: Math.max(0, scrollX),
                          top: Math.max(0, scrollY),
                          behavior: 'smooth'
                        });
                      }
                    } else {
                      alert('位置情報が取得できていません');
                    }
                  }}
                >
                  <MapPin className="h-4 w-4 text-gray-700" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-10 h-10 p-0 rounded-none border-b border-gray-200 hover:bg-gray-50 font-bold text-lg"
                  onClick={() => alert('ズーム機能（実装予定）')}
                >
                  +
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-10 h-10 p-0 rounded-none hover:bg-gray-50 font-bold text-lg"
                  onClick={() => alert('ズームアウト機能（実装予定）')}
                >
                  -
                </Button>
              </div>
              
              {/* 地図種別切り替え */}
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2 space-y-1">
                <button className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50 rounded">地図</button>
                <button className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50 rounded">航空写真</button>
                <button className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50 rounded">地形</button>
              </div>
            </div>
            
            {/* 詳細な凡例（Googleマップ風） */}
            <div className="absolute top-4 left-4 bg-white rounded-lg p-4 text-xs z-40 shadow-2xl border border-gray-200 max-w-48">
              <p className="font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">🗺️ 地図凡例</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full shadow-sm"></div>
                  <span className="text-gray-700">あなたの位置</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
                  <span className="text-gray-700">研修センター</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
                  <span className="text-gray-700">食堂</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                  <span className="text-gray-700">図書館</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded shadow-sm"></div>
                  <span className="text-gray-700">体育館</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded shadow-sm"></div>
                  <span className="text-gray-700">宿舎</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-2 bg-gray-700 rounded shadow-sm"></div>
                  <span className="text-gray-700">主要道路</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-2 bg-blue-400 rounded shadow-sm"></div>
                  <span className="text-gray-700">河川</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full shadow-sm"></div>
                  <span className="text-gray-700">森林・公園</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-300 rounded shadow-sm"></div>
                  <span className="text-gray-700">駐車場</span>
                </div>
              </div>
            </div>
            
            {/* 位置情報パネル（より詳細） */}
            {userLocation && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 text-sm z-40 shadow-2xl border border-gray-200">
                <p className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">📍 位置情報詳細</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">緯度:</span> {userLocation[0].toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">経度:</span> {userLocation[1].toFixed(6)}
                  </div>
                  <div className={`font-medium ${locationPermission === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
                    {locationPermission === 'granted' ? '✅ GPS有効' : '❌ GPS無効'}
                  </div>
                  <div className="text-gray-500">
                    <span className="font-medium">精度:</span> {gpsAccuracy ? `±${Math.round(gpsAccuracy)}m` : '±10m'}
                  </div>
                  <div className="text-gray-500">
                    <span className="font-medium">標高:</span> 約650m
                  </div>
                  <div className="text-gray-500">
                    <span className="font-medium">座標系:</span> WGS84
                  </div>
                </div>
              </div>
            )}
            
            {/* スケール表示（より詳細） */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 text-xs z-40 shadow-2xl border border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-black"></div>
                  <span className="text-gray-700 font-medium">100m</span>
                </div>
                <div className="text-gray-500 text-center">1:2000</div>
              </div>
            </div>
            
            {/* 方位コンパス */}
            <div className="absolute top-20 right-4 w-12 h-12 bg-white rounded-full shadow-2xl border border-gray-200 z-40 flex items-center justify-center">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border border-gray-300"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-red-500"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-500">N</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* オンラインユーザー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>オンラインの学生</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {onlineUsers.length > 0 ? (
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">白峰村内</p>
                  </div>
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">現在オンラインの学生はいません</p>
              <p className="text-xs text-gray-400">
                {user ? `${user.displayName || 'あなた'}がオンラインです` : 'ログインしてオンライン状態を表示'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 下部ナビゲーションバー（Instagram/Twitter風） */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {/* ホーム */}
            <Link href="/dashboard" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">ホーム</span>
            </Link>
            
            {/* カレンダー */}
            <Link href="/calendar" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200">
              <Calendar className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">予定</span>
            </Link>
            
            {/* マップ（現在のページ） */}
            <Link href="/map" className="flex flex-col items-center py-2 px-3 text-blue-600 bg-blue-50 rounded-lg">
              <MapPin className="h-6 w-6 mb-1" />
              <span className="text-xs font-bold">マップ</span>
            </Link>
            
            {/* クエスト */}
            <Link href="/quest" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <Trophy className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">クエスト</span>
            </Link>
            
            {/* チャット */}
            <Link href="/chat" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-orange-600 transition-colors duration-200 relative">
              <MessageCircle className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">チャット</span>
              {/* 未読バッジ（サンプル） */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 下部ナビゲーション分のスペース確保 */}
      <div className="h-20"></div>
    </div>
  );
}
