// 魚 component — 有 image 嘅用真實相，無就用 SVG fallback
import React from 'react'

const FishArt = ({ fish, animationClass = '', size = 80, onClick, className = '' }) => {
  // 真實相優先
  if (fish.image) {
    return (
      <div
        className={`relative ${animationClass} ${className}`}
        style={{ width: size, height: size * 0.75 }}
        onClick={onClick}
      >
        <img
          src={fish.image}
          alt={fish.name}
          className="w-full h-full object-contain drop-shadow-lg"
          loading="lazy"
        />
        {fish.rarity >= 4 && (
          <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 blur-md animate-pulse pointer-events-none"></div>
        )}
      </div>
    )
  }

  // SVG fallback
  if (fish.swimPattern === 'vertical') {
    return (
      <div className={`relative ${animationClass} ${className}`} style={{ width: size, height: size * 1.2 }}>
        <svg viewBox="0 0 60 80" className="w-full h-full">
          <path d="M 25 10 Q 35 5 40 20 Q 45 40 38 60 Q 35 75 28 75 Q 22 75 22 60 Q 18 40 22 20 Q 22 10 25 10 Z"
            fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
          <circle cx="28" cy="25" r="2" fill="#fff" />
          <circle cx="28" cy="25" r="1" fill="#000" />
          <path d="M 25 12 L 27 8 L 29 12 L 31 8 L 33 12" stroke={fish.bodyColor} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative ${animationClass} ${className}`} style={{ width: size, height: size * 0.6 }}>
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <ellipse cx="45" cy="30" rx="32" ry="18" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
        <path d="M 75 30 L 95 15 L 90 30 L 95 45 L 75 30 Z" fill={fish.color} stroke={fish.bodyColor} strokeWidth="1.5" />
        <circle cx="22" cy="28" r="4" fill="#fff" />
        <circle cx="22" cy="28" r="2" fill="#000" />
        <path d="M 12 32 Q 8 30 12 28" stroke={fish.bodyColor} strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

export default FishArt