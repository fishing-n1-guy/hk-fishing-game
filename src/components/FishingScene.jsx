// 沉浸式釣魚場景：真實釣點背景 + 釣竿 + 魚絲 + 浮標
import { useEffect, useRef } from 'react'

export default function FishingScene({ spot, phase, castPower = 0, bitePos = 0, reelProgress = 0, children }) {
  // 拋竿角度跟 castPower (45° - 80°)
  const angle = 45 + (castPower / 100) * 35
  // 浮標位置 (拋竿出去後浮喺中間)
  const floatVisible = phase === 'wait' || phase === 'reel' || phase === 'cast'
  const floatBite = phase === 'reel' // 魚訊時下沉

  return (
    <div className="relative w-full h-[55vh] overflow-hidden bg-ocean-900">
      {/* 真實釣點背景 */}
      <img
        src={`${import.meta.env.BASE_URL}spots/${spot.id}.jpg`}
        alt={spot.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* 漸層 overlay — 提升前景可讀性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
      {/* 天空泛光效果 */}
      {phase !== 'cast' && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      )}

      {/* 釣竿 SVG（右下角伸出） */}
      <div className="absolute bottom-0 right-0 w-32 h-64 pointer-events-none">
        <svg viewBox="0 0 100 200" className="w-full h-full">
          <line x1="80" y1="200" x2="20" y2="20" stroke="#3d2817" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="200" x2="20" y2="20" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 魚絲 + 浮標 */}
      {floatVisible && (
        <>
          {/* 魚絲 */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '15%',
              bottom: 0,
              width: '1px',
              height: `${40 + (castPower / 100) * 25}%`,
              background: 'rgba(255,255,255,0.6)',
            }}
          />
          {/* 浮標 — 喺水中央 */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
              floatBite ? 'animate-bounce' : 'animate-bob'
            }`}
            style={{
              bottom: `${30 - (floatBite && reelProgress > bitePos - 15 && reelProgress < bitePos + 15 ? 8 : 0)}%`,
            }}
          >
            <div className="w-6 h-10 bg-gradient-to-b from-red-500 via-white to-red-500 rounded-full shadow-lg border-2 border-red-700"></div>
            {floatBite && (
              <div className="absolute -inset-4 rounded-full border-4 border-yellow-300 animate-ping opacity-50"></div>
            )}
          </div>
          {/* 魚絲尾端連住浮標 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              bottom: `${30 + 5}%`,
              width: '1px',
              height: '40%',
              background: 'rgba(255,255,255,0.4)',
            }}
          />
        </>
      )}

      {/* 水波 effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 to-transparent"></div>
        <svg className="absolute bottom-0 w-full h-12 opacity-30" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 50 Q 250 30 500 50 T 1000 50 L 1000 100 L 0 100 Z" fill="rgba(255,255,255,0.2)">
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="M 0 50 Q 250 30 500 50 T 1000 50 L 1000 100 L 0 100 Z;
                      M 0 50 Q 250 70 500 50 T 1000 50 L 1000 100 L 0 100 Z;
                      M 0 50 Q 250 30 500 50 T 1000 50 L 1000 100 L 0 100 Z" />
          </path>
        </svg>
      </div>

      {/* 前景 children (UI overlay) */}
      <div className="absolute inset-0 flex flex-col">
        {children}
      </div>
    </div>
  )
}