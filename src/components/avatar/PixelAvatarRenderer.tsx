'use client';

import React from 'react';

interface AvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothing: string;
  accessory: string;
  face: string;
  background?: string;
}

interface PixelAvatarRendererProps {
  config: AvatarConfig;
  size?: number;
  direction?: string;
}

export const PixelAvatarRenderer: React.FC<PixelAvatarRendererProps> = ({ 
  config, 
  size = 48, 
  direction = 'down' 
}) => {
  const pixelSize = size / 16; // 16x16ピクセルベース

  // 肌色の定義
  const getSkinColor = (skinColor: string) => {
    const colors = {
      light: '#fdbcb4',
      medium: '#e8a87c',
      dark: '#c67e5c',
      pale: '#f7d1c9'
    };
    return colors[skinColor as keyof typeof colors] || colors.light;
  };

  // 髪色の定義
  const getHairColor = (hairColor: string) => {
    const colors = {
      black: '#2c1b18',
      brown: '#6f4e37',
      blonde: '#faf0be',
      red: '#c54a2c',
      blue: '#4a90e2',
      green: '#5cb85c',
      purple: '#8e44ad',
      white: '#f8f9fa',
      pink: '#ff69b4'
    };
    return colors[hairColor as keyof typeof colors] || colors.brown;
  };

  // 服の色の定義
  const getClothingColor = (clothing: string) => {
    const colors = {
      blue: '#007bff',
      red: '#dc3545',
      green: '#28a745',
      yellow: '#ffc107',
      purple: '#6f42c1',
      orange: '#fd7e14'
    };
    return colors[clothing as keyof typeof colors] || colors.blue;
  };

  // ピクセルデータを生成
  const generatePixelData = () => {
    const skinColor = getSkinColor(config.skinColor);
    const hairColor = getHairColor(config.hairColor);
    const clothingColor = getClothingColor(config.clothing);
    
    // 16x16のピクセル配列
    const pixels: (string | null)[][] = Array(16).fill(null).map(() => Array(16).fill(null));
    
    // 基本の頭部（肌色）
    const headPixels = [
      [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
      [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7],
      [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 8],
      [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9],
      [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10]
    ];
    
    headPixels.forEach(([x, y]) => {
      if (x >= 0 && x < 16 && y >= 0 && y < 16) {
        pixels[y][x] = skinColor;
      }
    });

    // 髪型の描画
    if (config.hairStyle === 'short') {
      const shortHairPixels = [
        [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
        [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5],
        [3, 6], [4, 6], [11, 6], [12, 6],
        [3, 7], [12, 7]
      ];
      shortHairPixels.forEach(([x, y]) => {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
          pixels[y][x] = hairColor;
        }
      });
    } else if (config.hairStyle === 'long') {
      const longHairPixels = [
        [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4],
        [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5],
        [3, 6], [4, 6], [11, 6], [12, 6],
        [3, 7], [12, 7],
        [3, 8], [12, 8],
        [3, 9], [12, 9],
        [4, 10], [11, 10]
      ];
      longHairPixels.forEach(([x, y]) => {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
          pixels[y][x] = hairColor;
        }
      });
    } else if (config.hairStyle === 'ponytail') {
      const ponytailPixels = [
        [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
        [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5],
        [3, 6], [4, 6], [11, 6], [12, 6],
        [3, 7], [12, 7], [13, 7],
        [13, 8], [14, 8],
        [14, 9]
      ];
      ponytailPixels.forEach(([x, y]) => {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
          pixels[y][x] = hairColor;
        }
      });
    } else if (config.hairStyle === 'bob') {
      const bobPixels = [
        [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4],
        [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5],
        [3, 6], [4, 6], [11, 6], [12, 6],
        [3, 7], [12, 7],
        [3, 8], [12, 8],
        [4, 9], [11, 9]
      ];
      bobPixels.forEach(([x, y]) => {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
          pixels[y][x] = hairColor;
        }
      });
    } else if (config.hairStyle === 'curly') {
      const curlyPixels = [
        [4, 3], [5, 3], [6, 3], [8, 3], [9, 3], [10, 3], [11, 3],
        [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4],
        [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5],
        [3, 6], [4, 6], [11, 6], [12, 6],
        [3, 7], [12, 7]
      ];
      curlyPixels.forEach(([x, y]) => {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
          pixels[y][x] = hairColor;
        }
      });
    }

    // 目の描画（表情によって変化）
    if (config.face === 'happy') {
      pixels[8][6] = '#000';
      pixels[8][9] = '#000';
      pixels[9][5] = '#000';
      pixels[9][6] = '#000';
      pixels[9][7] = '#000';
      pixels[9][8] = '#000';
      pixels[9][9] = '#000';
      pixels[9][10] = '#000';
    } else if (config.face === 'smile') {
      pixels[8][6] = '#000';
      pixels[8][9] = '#000';
      pixels[9][6] = '#000';
      pixels[9][7] = '#000';
      pixels[9][8] = '#000';
      pixels[9][9] = '#000';
    } else if (config.face === 'wink') {
      pixels[8][6] = '#000';
      pixels[8][7] = '#000';
      pixels[8][9] = '#000';
      pixels[9][7] = '#000';
      pixels[9][8] = '#000';
      pixels[9][9] = '#000';
    } else if (config.face === 'cool') {
      pixels[8][6] = '#000';
      pixels[8][7] = '#000';
      pixels[8][8] = '#000';
      pixels[8][9] = '#000';
      pixels[9][7] = '#000';
      pixels[9][8] = '#000';
    } else if (config.face === 'surprise') {
      pixels[7][6] = '#000';
      pixels[8][5] = '#000';
      pixels[8][6] = '#fff';
      pixels[8][7] = '#000';
      pixels[9][6] = '#000';
      pixels[7][9] = '#000';
      pixels[8][8] = '#000';
      pixels[8][9] = '#fff';
      pixels[8][10] = '#000';
      pixels[9][9] = '#000';
      pixels[10][7] = '#000';
      pixels[10][8] = '#000';
    } else {
      // デフォルト表情
      pixels[8][6] = '#000';
      pixels[8][9] = '#000';
    }

    // 体部分（服）
    const bodyPixels = [
      [6, 11], [7, 11], [8, 11], [9, 11],
      [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12],
      [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13],
      [5, 14], [6, 14], [7, 14], [8, 14], [9, 14], [10, 14],
      [6, 15], [7, 15], [8, 15], [9, 15]
    ];
    
    bodyPixels.forEach(([x, y]) => {
      if (x >= 0 && x < 16 && y >= 0 && y < 16) {
        pixels[y][x] = clothingColor;
      }
    });

    // アクセサリーの描画
    if (config.accessory === 'glasses') {
      pixels[8][5] = '#000';
      pixels[8][6] = '#000';
      pixels[8][7] = '#000';
      pixels[8][8] = '#000';
      pixels[8][9] = '#000';
      pixels[8][10] = '#000';
      pixels[7][6] = '#87ceeb';
      pixels[9][6] = '#87ceeb';
      pixels[7][9] = '#87ceeb';
      pixels[9][9] = '#87ceeb';
    } else if (config.accessory === 'hat') {
      pixels[3][6] = '#8b0000';
      pixels[3][7] = '#8b0000';
      pixels[3][8] = '#8b0000';
      pixels[3][9] = '#8b0000';
      pixels[2][5] = '#8b0000';
      pixels[2][6] = '#8b0000';
      pixels[2][7] = '#8b0000';
      pixels[2][8] = '#8b0000';
      pixels[2][9] = '#8b0000';
      pixels[2][10] = '#8b0000';
    } else if (config.accessory === 'crown') {
      pixels[2][6] = '#ffd700';
      pixels[2][7] = '#ffd700';
      pixels[2][8] = '#ffd700';
      pixels[2][9] = '#ffd700';
      pixels[1][6] = '#ffd700';
      pixels[1][8] = '#ffd700';
      pixels[0][7] = '#ffd700';
    } else if (config.accessory === 'earphones') {
      pixels[6][3] = '#000';
      pixels[7][3] = '#000';
      pixels[8][3] = '#000';
      pixels[9][3] = '#000';
      pixels[6][4] = '#000';
      pixels[9][4] = '#000';
      pixels[3][7] = '#000';
      pixels[3][8] = '#000';
      pixels[12][7] = '#000';
      pixels[12][8] = '#000';
    }

    return pixels;
  };

  const pixelData = generatePixelData();

  return (
    <div 
      className="relative inline-block"
      style={{ 
        width: size, 
        height: size,
        imageRendering: 'pixelated'
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated' }}
      >
        {pixelData.map((row, y) =>
          row.map((color, x) =>
            color ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill={color}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
