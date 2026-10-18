// 魚 SVG 插畫組件 — 根據 swimPattern 動
// 用 emoji 風格，唔需要真實插畫
import React from 'react'

const FishArt = ({ fish, animationClass = 'animate-swim1', size = 60 }) => {
  // 根據 rarity 決定有冇光環
  const hasGlow = fish.rarity >= 4

  // body shape
  const bodyStyle = {
    width: `${size}px`,
    height: `${size * 0.6}px`,
  }

  // 不同 swim pattern 用不同 SVG
  if (fish.swimPattern === 'vertical') {
    // 海馬 — 直立
    return (
      <div
        className={`relative ${animationClass}`}
        style={{ width: size, height: size * 1.2 }}
      >
        {hasGlow && <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 blur-md"></div>}
        <svg viewBox="0 0 60 80" className="w-full h-full">
          {/* 身體 */}
          <path d="M 25 10 Q 35 5 40 20 Q 45 40 38 60 Q 35 75 28 75 Q 22 75 22 60 Q 18 40 22 20 Q 22 10 25 10 Z"
            fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
          {/* 眼 */}
          <circle cx="28" cy="25" r="2" fill="#fff" />
          <circle cx="28" cy="25" r="1" fill="#000" />
          {/* 冠 */}
          <path d="M 25 12 L 27 8 L 29 12 L 31 8 L 33 12" stroke={fish.bodyColor} strokeWidth="1.5" fill="none" />
          {/* 鰭 */}
          <path d="M 22 35 Q 15 38 18 45" stroke={fish.bodyColor} strokeWidth="1" fill={fish.bodyColor} opacity="0.6" />
          <path d="M 40 35 Q 47 38 44 45" stroke={fish.bodyColor} strokeWidth="1" fill={fish.bodyColor} opacity="0.6" />
        </svg>
      </div>
    )
  }

  if (fish.swimPattern === 'bottom') {
    // 底棲魚 — 石斑、蟹
    if (fish.id === 'xie' || fish.id === 'shibang') {
      // 蟹 / 龍蝦
      return (
        <div className={`relative ${animationClass}`} style={{ width: size, height: size * 0.6 }}>
          <svg viewBox="0 0 80 50" className="w-full h-full">
            <ellipse cx="40" cy="25" rx="22" ry="13" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
            {/* 螯 */}
            <path d="M 18 25 Q 10 18 8 25 Q 10 32 18 28" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
            <path d="M 62 25 Q 70 18 72 25 Q 70 32 62 28" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
            {/* 眼 */}
            <circle cx="32" cy="20" r="2.5" fill="#fff" />
            <circle cx="48" cy="20" r="2.5" fill="#fff" />
            <circle cx="32" cy="20" r="1" fill="#000" />
            <circle cx="48" cy="20" r="1" fill="#000" />
            {/* 腳 */}
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1={20 + i * 12} y1="35" x2={17 + i * 12} y2="45" stroke={fish.bodyColor} strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      )
    }
  }

  // 標準魚
  return (
    <div
      className={`relative ${animationClass}`}
      style={bodyStyle}
    >
      {hasGlow && (
        <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-40 blur-md animate-pulse"></div>
      )}
      <svg viewBox="0 0 100 60" className="w-full h-full relative">
        {/* 魚身 */}
        <ellipse cx="45" cy="30" rx="32" ry="18" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
        {/* 魚尾 */}
        <path d="M 75 30 L 95 15 L 90 30 L 95 45 L 75 30 Z" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
        {/* 背鰭 */}
        <path d="M 35 12 Q 45 5 55 12" stroke={fish.bodyColor} strokeWidth="1.5" fill={fish.bodyColor} opacity="0.6" />
        {/* 腹鰭 */}
        <path d="M 35 48 Q 45 55 55 48" stroke={fish.bodyColor} strokeWidth="1.5" fill={fish.bodyColor} opacity="0.6" />
        {/* 眼 */}
        <circle cx="22" cy="28" r="4" fill="#fff" />
        <circle cx="22" cy="28" r="2" fill="#000" />
        {/* 腮 */}
        <path d="M 32 22 Q 35 30 32 38" stroke={fish.bodyColor} strokeWidth="1" fill="none" opacity="0.6" />
        {/* 嘴 */}
        <path d="M 12 32 Q 8 30 12 28" stroke={fish.bodyColor} strokeWidth="1" fill="none" />
        {/* 鱗片 hint */}
        <path d="M 45 18 Q 50 22 45 26 M 55 18 Q 60 22 55 26 M 65 18 Q 70 22 65 26" stroke={fish.bodyColor} strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
    </div>
  )
}

export default FishArt