import { useState } from 'react';

interface PixelAvatarStyle {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothing: string;
  accessory: string;
  face: string;
  background: string;
}

interface PixelAvatarProps {
  style: PixelAvatarStyle;
  size?: number;
  isMoving?: boolean;
  direction?: string;
  showName?: string;
}

// ドット絵風アバターコンポーネント
export function PixelAvatar({ 
  style, 
  size = 48, 
  isMoving = false, 
  direction = 'down',
  showName 
}: PixelAvatarProps) {
  
  // カラーパレット
  const colors = {
    skin: {
      light: '#fdbcb4',
      medium: '#e8a87c',
      dark: '#c67e5c',
      pale: '#f7d1c9'
    },
    hair: {
      black: '#2c1b18',
      brown: '#6f4e37',
      blonde: '#faf0be',
      red: '#c54a2c',
      blue: '#4a90e2',
      green: '#5cb85c',
      purple: '#8e44ad',
      white: '#f8f9fa',
      pink: '#ff69b4'
    },
    clothing: {
      red: '#dc3545',
      blue: '#007bff',
      green: '#28a745',
      yellow: '#ffc107',
      purple: '#6f42c1',
      orange: '#fd7e14',
      pink: '#e83e8c',
      teal: '#20c997',
      indigo: '#6610f2',
      cyan: '#17a2b8'
    }
  };

  // ドット絵パターン生成
  const generatePixelPattern = () => {
    const pixels = [];
    const pixelSize = size / 16; // 16x16 ドット

    // 背景
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let color = 'transparent';
        const key = `${x}-${y}`;

        // 顔の輪郭 (肌色)
        if (isFacePixel(x, y)) {
          color = colors.skin[style.skinColor as keyof typeof colors.skin] || colors.skin.light;
        }
        
        // 髪の毛
        else if (isHairPixel(x, y, style.hairStyle)) {
          color = colors.hair[style.hairColor as keyof typeof colors.hair] || colors.hair.black;
        }
        
        // 服
        else if (isClothingPixel(x, y, style.clothing)) {
          color = colors.clothing[style.clothing as keyof typeof colors.clothing] || colors.clothing.blue;
        }
        
        // 目
        else if (isEyePixel(x, y, style.face)) {
          color = '#000000';
        }
        
        // 口
        else if (isMouthPixel(x, y, style.face)) {
          color = '#ff6b9d';
        }

        if (color !== 'transparent') {
          pixels.push(
            <div
              key={key}
              className="absolute"
              style={{
                left: x * pixelSize,
                top: y * pixelSize,
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color,
              }}
            />
          );
        }
      }
    }

    return pixels;
  };

  // 顔のピクセル判定
  const isFacePixel = (x: number, y: number): boolean => {
    // 楕円形の顔
    const centerX = 8, centerY = 10;
    const radiusX = 4, radiusY = 5;
    const dx = x - centerX, dy = y - centerY;
    return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
  };

  // 髪のピクセル判定
  const isHairPixel = (x: number, y: number, hairStyle: string): boolean => {
    switch (hairStyle) {
      case 'short':
        return y <= 8 && x >= 4 && x <= 11 && 
               Math.sqrt((x - 8) ** 2 + (y - 6) ** 2) <= 4;
      case 'long':
        return (y <= 8 && x >= 3 && x <= 12) || 
               (y <= 12 && x >= 4 && x <= 11 && Math.abs(x - 8) >= 2);
      case 'ponytail':
        return (y <= 8 && x >= 4 && x <= 11) || 
               (x === 12 && y >= 6 && y <= 10);
      case 'curly':
        return y <= 9 && x >= 3 && x <= 12 && 
               (Math.sin(x * 0.8) + Math.cos(y * 0.8)) > 0.3;
      case 'spiky':
        return y <= 7 && x >= 4 && x <= 11 && 
               Math.abs(Math.sin(x * 2) * 2) + y <= 8;
      default:
        return y <= 8 && x >= 4 && x <= 11;
    }
  };

  // 服のピクセル判定
  const isClothingPixel = (x: number, y: number, clothing: string): boolean => {
    switch (clothing) {
      case 'tshirt':
        return y >= 13 && x >= 5 && x <= 10;
      case 'hoodie':
        return (y >= 13 && x >= 4 && x <= 11) || 
               (y === 12 && x >= 6 && x <= 9);
      case 'dress':
        return (y >= 13 && x >= 3 && x <= 12) || 
               (y === 15 && x >= 2 && x <= 13);
      case 'suit':
        return (y >= 13 && x >= 5 && x <= 10) && 
               ((x === 5 || x === 10) || (y === 13));
      case 'uniform':
        return (y >= 13 && x >= 5 && x <= 10) || 
               (y === 14 && x >= 6 && x <= 9);
      default:
        return y >= 13 && x >= 5 && x <= 10;
    }
  };

  // 目のピクセル判定
  const isEyePixel = (x: number, y: number, face: string): boolean => {
    const leftEye = x === 6 && y === 9;
    const rightEye = x === 9 && y === 9;
    
    switch (face) {
      case 'happy':
        return leftEye || rightEye;
      case 'wink':
        return rightEye || (x === 6 && y === 8); // ウィンク
      case 'sleepy':
        return (x === 6 && y === 8) || (x === 9 && y === 8); // 細い目
      default:
        return leftEye || rightEye;
    }
  };

  // 口のピクセル判定
  const isMouthPixel = (x: number, y: number, face: string): boolean => {
    switch (face) {
      case 'happy':
        return (x >= 6 && x <= 9 && y === 11) || 
               (x === 6 && y === 12) || (x === 9 && y === 12);
      case 'surprised':
        return x === 7 && y === 11;
      default:
        return x >= 7 && x <= 8 && y === 11;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`relative ${isMoving ? 'animate-bounce' : ''} ${
          direction === 'left' ? 'scale-x-[-1]' : ''
        } transition-transform duration-200`}
        style={{ width: size, height: size }}
      >
        {/* ドット絵パターン */}
        <div className="absolute inset-0" style={{ imageRendering: 'pixelated' }}>
          {generatePixelPattern()}
        </div>

        {/* アクセサリーオーバーレイ */}
        {style.accessory !== 'none' && (
          <div className="absolute -top-1 -right-1 text-lg">
            {style.accessory === 'crown' && '👑'}
            {style.accessory === 'hat' && '🎩'}
            {style.accessory === 'glasses' && '🤓'}
            {style.accessory === 'flower' && '🌸'}
            {style.accessory === 'bow' && '🎀'}
            {style.accessory === 'star' && '⭐'}
          </div>
        )}

        {/* 移動インジケーター */}
        {isMoving && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {/* 名前表示 */}
      {showName && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          {showName}
        </div>
      )}
    </div>
  );
}

export default PixelAvatar;
export type { PixelAvatarStyle };
