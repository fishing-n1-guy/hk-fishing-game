// 沉浸式釣魚場景 v2 — 參考 Bobber Fishing + Fishing Planet
// 真實釣點背景 + 浮標魚漂 + 魚訊漣漪 + 魚絲由釣竿尖端出
import { useState, useEffect } from 'react'

export default function FishingScene({ spot, phase, castPower = 0, bitePos = 0, reelProgress = 0, children }) {
  // 魚訊漣漪 trigger
  const [bitePulse, setBitePulse] = useState(0)
  useEffect(() => {
    if (phase !== 'reel') return
    const interval = setInterval(() => {
      setBitePulse(p => p + 1)
    }, 800)
    return () => clearInterval(interval)
  }, [phase])

  // 浮標位置：根據 castPower 喺水面
  const floatDistance = 30 + (castPower / 100) * 35 // 30-65%
  const floatDip = phase === 'reel' ? 8 : 0

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-ocean-900">
      {/* 真實釣點背景 — 全屏 cover */}
      <img
        src={`${import.meta.env.BASE_URL}spots/${spot.id}.jpg`}
        alt={spot.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* 天空 overlay 漸層 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

      {/* 釣竿 — 由右下伸出 perspective 60° */}
      <svg
        className="absolute bottom-0 right-0 w-48 h-72 pointer-events-none"
        viewBox="0 0 200 300"
      >
        <line x1="180" y1="300" x2="60" y2="40" stroke="#2d1810" strokeWidth="6" strokeLinecap="round" />
        <line x1="180" y1="300" x2="60" y2="40" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" />
        <line x1="180" y1="300" x2="60" y2="40" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="40" r="4" fill="#fcd34d" />
        <circle cx="170" cy="280" r="14" fill="#374151" stroke="#1f2937" strokeWidth="2" />
        <circle cx="170" cy="280" r="6" fill="#9ca3af" />
      </svg>

      {/* 魚絲 SVG (竿尖 → 浮標) */}
      {(phase === 'cast' || phase === 'wait' || phase === 'reel') && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* 主魚絲 (竿尖 → 浮標) — viewBox 100x100 對應百分比 */}
          <line
            x1={85 - (castPower / 100) * 5}
            y1={12 + (castPower / 100) * 5}
            x2={floatDistance}
            y2={55 + floatDip}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
          {/* 魚絲尾 (入水) */}
          <line
            x1={floatDistance}
            y1={55 + floatDip}
            x2={floatDistance + 1}
            y2={72}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.3"
            strokeDasharray="2,1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* 浮標 (Bobber) — 魚漂：紅頂白身紅底 */}
      {(phase === 'cast' || phase === 'wait' || phase === 'reel') && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            left: `${floatDistance}%`,
            top: `${55 + floatDip}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* 魚訊漣漪 */}
          {phase === 'reel' && (
            <>
              <div
                className="absolute left-1/2 top-1/2 rounded-full border-2 border-yellow-300 pointer-events-none"
                style={{
                  width: '30px', height: '30px',
                  animation: `ripple-out 1.2s ease-out ${(bitePulse % 3) * 0.4}s infinite`,
                  opacity: 0.7,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 rounded-full border-2 border-yellow-400 pointer-events-none"
                style={{
                  width: '30px', height: '30px',
                  animation: `ripple-out 1.2s ease-out ${(bitePulse % 3) * 0.4 + 0.4}s infinite`,
                  opacity: 0.5,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </>
          )}
          {/* 魚漂 */}
          <div className={`${phase === 'reel' ? 'animate-bounce' : 'animate-bob'} relative`}>
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md border border-red-700 mx-auto"></div>
            <div className="w-2.5 h-6 bg-white border border-gray-300 mx-auto"></div>
            <div className="w-3 h-2 rounded-full bg-red-500 shadow-md border border-red-700 mx-auto"></div>
          </div>
        </div>
      )}

      {/* 水面 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/40 via-cyan-400/20 to-transparent"></div>
        <svg className="absolute bottom-0 w-full opacity-30" viewBox="0 0 1000 80" preserveAspectRatio="none" style={{height: '30px'}}>
          <path d="M 0 40 Q 250 20 500 40 T 1000 40 L 1000 80 L 0 80 Z" fill="rgba(255,255,255,0.3)">
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="M 0 40 Q 250 20 500 40 T 1000 40 L 1000 80 L 0 80 Z;
                      M 0 40 Q 250 60 500 40 T 1000 40 L 1000 80 L 0 80 Z;
                      M 0 40 Q 250 20 500 40 T 1000 40 L 1000 80 L 0 80 Z" />
          </path>
        </svg>
      </div>

      {/* 前景 children */}
      <div className="absolute inset-0 flex flex-col">
        {children}
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes ripple-out {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}