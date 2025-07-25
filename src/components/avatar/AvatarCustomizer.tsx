import { useState } from 'react';

interface AvatarStyle {
  color: string;
  shape: string;
  accessory: string;
}

// アバターカスタマイザーコンポーネント
function AvatarCustomizer({ 
  currentStyle, 
  onStyleChange, 
  onClose 
}: { 
  currentStyle: AvatarStyle, 
  onStyleChange: (style: AvatarStyle) => void,
  onClose: () => void 
}) {
  const [tempStyle, setTempStyle] = useState<AvatarStyle>(currentStyle);

  const colors = [
    { name: 'ブルー', value: 'blue', color: 'bg-blue-500' },
    { name: 'グリーン', value: 'green', color: 'bg-green-500' },
    { name: 'レッド', value: 'red', color: 'bg-red-500' },
    { name: 'パープル', value: 'purple', color: 'bg-purple-500' },
    { name: 'イエロー', value: 'yellow', color: 'bg-yellow-500' },
    { name: 'ピンク', value: 'pink', color: 'bg-pink-500' }
  ];

  const shapes = [
    { name: '丸', value: 'circle', icon: '⭕' },
    { name: '四角', value: 'square', icon: '⬜' },
    { name: 'ダイヤ', value: 'diamond', icon: '💎' }
  ];

  const accessories = [
    { name: 'なし', value: 'none', icon: '❌' },
    { name: '王冠', value: 'crown', icon: '👑' },
    { name: '帽子', value: 'hat', icon: '🎩' },
    { name: 'メガネ', value: 'glasses', icon: '🤓' }
  ];

  const handleSave = () => {
    onStyleChange(tempStyle);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">アバターカスタマイズ</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* プレビュー */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`
              w-20 h-20 border-4 flex items-center justify-center text-white font-bold text-lg
              ${tempStyle.color === 'blue' && 'border-blue-600 bg-blue-500'}
              ${tempStyle.color === 'green' && 'border-green-600 bg-green-500'}
              ${tempStyle.color === 'red' && 'border-red-600 bg-red-500'}
              ${tempStyle.color === 'purple' && 'border-purple-600 bg-purple-500'}
              ${tempStyle.color === 'yellow' && 'border-yellow-600 bg-yellow-500'}
              ${tempStyle.color === 'pink' && 'border-pink-600 bg-pink-500'}
              ${tempStyle.shape === 'circle' && 'rounded-full'}
              ${tempStyle.shape === 'square' && 'rounded-lg'}
              ${tempStyle.shape === 'diamond' && 'rounded-lg transform rotate-45'}
            `}>
              {tempStyle.accessory !== 'none' && (
                <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl">
                  {tempStyle.accessory === 'crown' && '👑'}
                  {tempStyle.accessory === 'hat' && '🎩'}
                  {tempStyle.accessory === 'glasses' && '🤓'}
                </div>
              )}
              プ
            </div>
          </div>
        </div>

        {/* カラー選択 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">カラー</h3>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setTempStyle({ ...tempStyle, color: color.value })}
                className={`
                  p-2 rounded-lg border-2 text-xs font-medium transition-all
                  ${tempStyle.color === color.value 
                    ? 'border-gray-800 bg-gray-100' 
                    : 'border-gray-200 hover:border-gray-400'}
                `}
              >
                <div className={`w-6 h-6 rounded-full ${color.color} mx-auto mb-1`}></div>
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* 形状選択 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">形状</h3>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape.value}
                onClick={() => setTempStyle({ ...tempStyle, shape: shape.value })}
                className={`
                  p-2 rounded-lg border-2 text-xs font-medium transition-all
                  ${tempStyle.shape === shape.value 
                    ? 'border-gray-800 bg-gray-100' 
                    : 'border-gray-200 hover:border-gray-400'}
                `}
              >
                <div className="text-lg mb-1">{shape.icon}</div>
                {shape.name}
              </button>
            ))}
          </div>
        </div>

        {/* アクセサリー選択 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">アクセサリー</h3>
          <div className="grid grid-cols-2 gap-2">
            {accessories.map((accessory) => (
              <button
                key={accessory.value}
                onClick={() => setTempStyle({ ...tempStyle, accessory: accessory.value })}
                className={`
                  p-2 rounded-lg border-2 text-xs font-medium transition-all
                  ${tempStyle.accessory === accessory.value 
                    ? 'border-gray-800 bg-gray-100' 
                    : 'border-gray-200 hover:border-gray-400'}
                `}
              >
                <div className="text-lg mb-1">{accessory.icon}</div>
                {accessory.name}
              </button>
            ))}
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export { AvatarCustomizer };
