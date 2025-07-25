import { useState } from 'react';
import { PixelAvatar, PixelAvatarStyle } from './PixelAvatar';

interface PixelAvatarCustomizerProps {
  currentStyle: PixelAvatarStyle;
  onStyleChange: (style: PixelAvatarStyle) => void;
  onClose: () => void;
}

export function PixelAvatarCustomizer({
  currentStyle,
  onStyleChange,
  onClose
}: PixelAvatarCustomizerProps) {
  const [tempStyle, setTempStyle] = useState<PixelAvatarStyle>(currentStyle);

  // 肌の色オプション
  const skinColors = [
    { name: '色白', value: 'pale', color: '#f7d1c9' },
    { name: '普通', value: 'light', color: '#fdbcb4' },
    { name: '健康的', value: 'medium', color: '#e8a87c' },
    { name: '日焼け', value: 'dark', color: '#c67e5c' }
  ];

  // 髪型オプション（大幅拡張）
  const hairStyles = [
    { name: 'ショート', value: 'short', icon: '✂️' },
    { name: 'ロング', value: 'long', icon: '💇‍♀️' },
    { name: 'ポニーテール', value: 'ponytail', icon: '🎀' },
    { name: 'カーリー', value: 'curly', icon: '🌀' },
    { name: 'スパイキー', value: 'spiky', icon: '⚡' },
    { name: 'ボブ', value: 'bob', icon: '💁‍♀️' },
    { name: 'ツインテール', value: 'twintails', icon: '👧' },
    { name: 'アップ', value: 'updo', icon: '👸' },
    { name: 'ウェーブ', value: 'wavy', icon: '🌊' },
    { name: 'ブレード', value: 'braided', icon: '🔗' }
  ];

  // 髪色オプション（拡張）
  const hairColors = [
    { name: '黒', value: 'black', color: '#2c1b18' },
    { name: '茶', value: 'brown', color: '#6f4e37' },
    { name: 'ブロンド', value: 'blonde', color: '#faf0be' },
    { name: '赤', value: 'red', color: '#c54a2c' },
    { name: '青', value: 'blue', color: '#4a90e2' },
    { name: '緑', value: 'green', color: '#5cb85c' },
    { name: '紫', value: 'purple', color: '#8e44ad' },
    { name: '白', value: 'white', color: '#f8f9fa' },
    { name: 'ピンク', value: 'pink', color: '#ff69b4' },
    { name: 'シルバー', value: 'silver', color: '#c0c0c0' },
    { name: 'オレンジ', value: 'orange', color: '#ff8c00' },
    { name: 'ターコイズ', value: 'turquoise', color: '#40e0d0' }
  ];

  // 服装オプション（大幅拡張）
  const clothingOptions = [
    { name: 'Tシャツ', value: 'tshirt', icon: '👕', color: 'blue' },
    { name: 'パーカー', value: 'hoodie', icon: '🧥', color: 'green' },
    { name: 'ワンピース', value: 'dress', icon: '👗', color: 'pink' },
    { name: 'スーツ', value: 'suit', icon: '🤵', color: 'indigo' },
    { name: '制服', value: 'uniform', icon: '👔', color: 'red' },
    { name: 'タンクトップ', value: 'tank', icon: '🎽', color: 'yellow' },
    { name: 'セーター', value: 'sweater', icon: '🧶', color: 'purple' },
    { name: 'ジャケット', value: 'jacket', icon: '🧥', color: 'teal' },
    { name: 'ブラウス', value: 'blouse', icon: '👚', color: 'orange' },
    { name: 'ポロシャツ', value: 'polo', icon: '👕', color: 'cyan' },
    { name: 'カーディガン', value: 'cardigan', icon: '🧥', color: 'pink' },
    { name: 'チュニック', value: 'tunic', icon: '👗', color: 'purple' },
    { name: 'ベスト', value: 'vest', icon: '🦺', color: 'red' },
    { name: 'コート', value: 'coat', icon: '🧥', color: 'indigo' },
    { name: 'キミソリ', value: 'kimono', icon: '👘', color: 'red' }
  ];

  // アクセサリーオプション（大幅拡張）
  const accessories = [
    { name: 'なし', value: 'none', icon: '❌' },
    { name: '王冠', value: 'crown', icon: '👑' },
    { name: '帽子', value: 'hat', icon: '🎩' },
    { name: 'メガネ', value: 'glasses', icon: '🤓' },
    { name: '花', value: 'flower', icon: '🌸' },
    { name: 'リボン', value: 'bow', icon: '🎀' },
    { name: 'スター', value: 'star', icon: '⭐' },
    { name: 'ハート', value: 'heart', icon: '💖' },
    { name: 'キャップ', value: 'cap', icon: '🧢' },
    { name: 'ヘッドバンド', value: 'headband', icon: '👤' },
    { name: 'イヤリング', value: 'earrings', icon: '💎' },
    { name: 'ネックレス', value: 'necklace', icon: '📿' },
    { name: 'マスク', value: 'mask', icon: '😷' },
    { name: 'サングラス', value: 'sunglasses', icon: '🕶️' },
    { name: 'ヘルメット', value: 'helmet', icon: '⛑️' }
  ];

  // 表情オプション（拡張）
  const faceOptions = [
    { name: '普通', value: 'normal', icon: '😐' },
    { name: 'ハッピー', value: 'happy', icon: '😊' },
    { name: 'ウィンク', value: 'wink', icon: '😉' },
    { name: 'びっくり', value: 'surprised', icon: '😲' },
    { name: '眠そう', value: 'sleepy', icon: '😴' },
    { name: 'クール', value: 'cool', icon: '😎' },
    { name: 'ニコニコ', value: 'smile', icon: '😄' },
    { name: 'うーん', value: 'thinking', icon: '🤔' }
  ];

  // 背景オプション
  const backgrounds = [
    { name: 'なし', value: 'none', color: 'transparent' },
    { name: '青空', value: 'sky', color: '#87ceeb' },
    { name: '夕焼け', value: 'sunset', color: '#ff7f50' },
    { name: '森', value: 'forest', color: '#228b22' },
    { name: '雪', value: 'snow', color: '#f0f8ff' },
    { name: '夜', value: 'night', color: '#191970' },
    { name: '桜', value: 'sakura', color: '#ffb6c1' }
  ];

  const handleSave = () => {
    onStyleChange(tempStyle);
    onClose();
  };

  const updateStyle = (key: keyof PixelAvatarStyle, value: string) => {
    setTempStyle(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">🎨 ドット絵アバター カスタマイズ</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* プレビューエリア */}
          <div className="flex justify-center mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">プレビュー</h3>
                <PixelAvatar 
                  style={tempStyle} 
                  size={96} 
                  showName="プレビュー"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">移動時</h3>
                <PixelAvatar 
                  style={tempStyle} 
                  size={96} 
                  isMoving={true}
                  direction="right"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左カラム */}
            <div className="space-y-6">
              {/* 肌の色 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">🎨 肌の色</h3>
                <div className="grid grid-cols-2 gap-2">
                  {skinColors.map((skin) => (
                    <button
                      key={skin.value}
                      onClick={() => updateStyle('skinColor', skin.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.skinColor === skin.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: skin.color }}
                      ></div>
                      {skin.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 髪型 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">💇‍♀️ 髪型</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hairStyles.map((hair) => (
                    <button
                      key={hair.value}
                      onClick={() => updateStyle('hairStyle', hair.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.hairStyle === hair.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-lg mb-1">{hair.icon}</div>
                      {hair.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 髪色 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">🌈 髪色</h3>
                <div className="grid grid-cols-3 gap-2">
                  {hairColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateStyle('hairColor', color.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.hairColor === color.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 表情 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">😊 表情</h3>
                <div className="grid grid-cols-2 gap-2">
                  {faceOptions.map((face) => (
                    <button
                      key={face.value}
                      onClick={() => updateStyle('face', face.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.face === face.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-lg mb-1">{face.icon}</div>
                      {face.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右カラム */}
            <div className="space-y-6">
              {/* 服装 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">👕 服装</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {clothingOptions.map((clothing) => (
                    <button
                      key={clothing.value}
                      onClick={() => updateStyle('clothing', clothing.color)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.clothing === clothing.color
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm mb-1">{clothing.icon}</div>
                      {clothing.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* アクセサリー */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">✨ アクセサリー</h3>
                <div className="grid grid-cols-3 gap-2">
                  {accessories.map((accessory) => (
                    <button
                      key={accessory.value}
                      onClick={() => updateStyle('accessory', accessory.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.accessory === accessory.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-lg mb-1">{accessory.icon}</div>
                      <div className="text-xs">{accessory.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 背景 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">🌅 背景</h3>
                <div className="grid grid-cols-2 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => updateStyle('background', bg.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        tempStyle.background === bg.value
                          ? 'border-gray-800 bg-gray-100' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded mx-auto mb-1 border"
                        style={{ backgroundColor: bg.color }}
                      ></div>
                      {bg.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              ✨ 保存して適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PixelAvatarCustomizer;
