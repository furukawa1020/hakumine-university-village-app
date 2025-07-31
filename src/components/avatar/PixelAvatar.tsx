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
  
  // 肌の色マッピング
  const getSkinColor = () => {
    const skinMap: Record<string, string> = {
      'light': '#fdbcb4',
      'medium': '#e8a87c',
      'dark': '#c67e5c',
      'pale': '#f7d1c9'
    };
    return skinMap[style.skinColor] || '#fdbcb4';
  };

  // 髪の色マッピング
  const getHairColor = () => {
    const hairColorMap: Record<string, string> = {
      'black': '#2c1b18',
      'brown': '#6f4e37',
      'blonde': '#faf0be',
      'red': '#c54a2c',
      'blue': '#4a90e2',
      'green': '#5cb85c',
      'purple': '#8e44ad',
      'white': '#f8f9fa',
      'pink': '#ff69b4'
    };
    return hairColorMap[style.hairColor] || '#6f4e37';
  };

  // 服の色マッピング
  const getClothingColor = () => {
    const clothingMap: Record<string, string> = {
      'blue': '#007bff',
      'red': '#dc3545',
      'green': '#28a745',
      'yellow': '#ffc107',
      'purple': '#6f42c1',
      'orange': '#fd7e14'
    };
    return clothingMap[style.clothing] || '#007bff';
  };

  // 髪型のSVGパス
  const getHairStyle = () => {
    const hairColor = getHairColor();
    
    switch (style.hairStyle) {
      case 'short':
        return (
          <g fill={hairColor}>
            <rect x="6" y="4" width="8" height="4" rx="4"/>
            <rect x="4" y="6" width="12" height="2" rx="1"/>
          </g>
        );
      case 'long':
        return (
          <g fill={hairColor}>
            <rect x="4" y="4" width="12" height="6" rx="6"/>
            <rect x="2" y="8" width="16" height="4" rx="2"/>
            <rect x="1" y="10" width="18" height="3" rx="1"/>
          </g>
        );
      case 'ponytail':
        return (
          <g fill={hairColor}>
            <rect x="6" y="4" width="8" height="4" rx="4"/>
            <rect x="4" y="6" width="12" height="2" rx="1"/>
            <circle cx="16" cy="8" r="2"/>
            <rect x="17" y="6" width="2" height="6" rx="1"/>
          </g>
        );
      case 'bob':
        return (
          <g fill={hairColor}>
            <rect x="4" y="4" width="12" height="6" rx="6"/>
            <rect x="3" y="8" width="14" height="3" rx="1"/>
          </g>
        );
      case 'curly':
        return (
          <g fill={hairColor}>
            <circle cx="7" cy="6" r="2"/>
            <circle cx="10" cy="5" r="2"/>
            <circle cx="13" cy="6" r="2"/>
            <circle cx="5" cy="8" r="1.5"/>
            <circle cx="15" cy="8" r="1.5"/>
            <circle cx="8" cy="8" r="1"/>
            <circle cx="12" cy="8" r="1"/>
          </g>
        );
      default:
        return (
          <g fill={hairColor}>
            <rect x="6" y="4" width="8" height="4" rx="4"/>
          </g>
        );
    }
  };

  // アクセサリーのSVG
  const getAccessory = () => {
    switch (style.accessory) {
      case 'glasses':
        return (
          <g>
            <rect x="5" y="10" width="4" height="3" fill="none" stroke="#333" strokeWidth="0.5" rx="1"/>
            <rect x="11" y="10" width="4" height="3" fill="none" stroke="#333" strokeWidth="0.5" rx="1"/>
            <line x1="9" y1="11" x2="11" y2="11" stroke="#333" strokeWidth="0.5"/>
          </g>
        );
      case 'hat':
        return (
          <g fill="#1a1a1a">
            <rect x="2" y="2" width="16" height="6" rx="8"/>
            <rect x="0" y="6" width="20" height="2" rx="1"/>
          </g>
        );
      case 'crown':
        return (
          <g fill="#ffd700">
            <rect x="4" y="3" width="12" height="3"/>
            <polygon points="6,3 7,0 8,3"/>
            <polygon points="9,3 10,1 11,3"/>
            <polygon points="12,3 13,0 14,3"/>
            <circle cx="10" cy="4" r="1" fill="#ff0000"/>
          </g>
        );
      case 'earphones':
        return (
          <g fill="#333">
            <rect x="2" y="6" width="2" height="3" rx="1"/>
            <rect x="16" y="6" width="2" height="3" rx="1"/>
            <path d="M4,7 Q10,2 16,7" stroke="#333" strokeWidth="1" fill="none"/>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${isMoving ? 'animate-bounce' : ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 20 20" 
        className="w-full h-full pixelated"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 顔の輪郭 */}
        <circle cx="10" cy="12" r="6" fill={getSkinColor()} stroke="#000" strokeWidth="0.3"/>
        
        {/* 髪型 */}
        {getHairStyle()}
        
        {/* 目 */}
        <circle cx="8" cy="11" r="0.8" fill="#000"/>
        <circle cx="12" cy="11" r="0.8" fill="#000"/>
        
        {/* 表情 */}
        {style.face === 'wink' ? (
          <g>
            <circle cx="8" cy="11" r="0.8" fill="#000"/>
            <path d="M11.2,10.5 Q12,11 12.8,10.5" stroke="#000" strokeWidth="0.3" fill="none"/>
          </g>
        ) : style.face === 'happy' || style.face === 'smile' ? (
          <path d="M8,13.5 Q10,15 12,13.5" stroke="#000" strokeWidth="0.4" fill="none"/>
        ) : style.face === 'cool' ? (
          <line x1="8" y1="13.5" x2="12" y2="13.5" stroke="#000" strokeWidth="0.3"/>
        ) : style.face === 'surprise' ? (
          <circle cx="10" cy="13.5" r="0.8" fill="none" stroke="#000" strokeWidth="0.3"/>
        ) : (
          <path d="M8.5,13.2 Q10,14 11.5,13.2" stroke="#000" strokeWidth="0.3" fill="none"/>
        )}
        
        {/* 鼻 */}
        <circle cx="10" cy="12.5" r="0.2" fill={getSkinColor()} stroke="#000" strokeWidth="0.1"/>
        
        {/* 体（服） */}
        <rect x="6" y="17" width="8" height="3" fill={getClothingColor()} stroke="#000" strokeWidth="0.2" rx="1"/>
        
        {/* アクセサリー */}
        {getAccessory()}
      </svg>
      
      {showName && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium">{showName}</p>
        </div>
      )}
    </div>
  );
}
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
