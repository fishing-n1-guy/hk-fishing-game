import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import FishingScene from '../components/FishingScene'
import FishArt from '../components/FishArt'
import { useGameStore } from '../store/gameStore'
import { FISHING_SPOTS } from '../data/spots'
import { TIMES_OF_DAY, SEASONS, WEATHERS } from '../data/equipment'

export default function FishPage({ onBack }) {
  const [phase, setPhase] = useState('list') // list | prep | cast | wait | reel | result
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [selectedTime, setSelectedTime] = useState('morning')
  const [selectedSeason, setSelectedSeason] = useState('summer')
  const [selectedWeather, setSelectedWeather] = useState('sunny')
  const [castPower, setCastPower] = useState(0)
  const [castCharging, setCastCharging] = useState(false)
  const [waitProgress, setWaitProgress] = useState(0)
  const [bitePos, setBitePos] = useState(0)
  const [reelProgress, setReelProgress] = useState(0)
  const [lastResult, setLastResult] = useState(null)

  const { isSpotUnlocked, castFishing, catchFish, currentRodLevel } = useGameStore()

  const startCast = () => {
    setPhase('cast')
    setCastPower(0)
    setCastCharging(true)
    // Power charges over 1.5s
    let p = 0
    const interval = setInterval(() => {
      p += 5
      setCastPower(p)
      if (p >= 100) {
        clearInterval(interval)
        setCastCharging(false)
        enterWait()
      }
    }, 60)
  }

  const stopCast = () => {
    if (!castCharging) return
    setCastCharging(false)
    enterWait()
  }

  const enterWait = () => {
    setPhase('wait')
    setWaitProgress(0)
    // 魚訊隨機出現
    const biteDelay = 2000 + Math.random() * 4000
    setTimeout(() => {
      const pos = 50 + Math.random() * 30 // 50-80%
      setBitePos(pos)
      setReelProgress(0)
      setPhase('reel')
    }, biteDelay)
  }

  const reelTap = () => {
    setReelProgress(p => Math.min(100, p + 8))
  }

  const reelProgressRef = useRef(0)
  const phaseRef = useRef('list')
  const bitePosRef = useRef(0)
  useEffect(() => { reelProgressRef.current = reelProgress }, [reelProgress])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { bitePosRef.current = bitePos }, [bitePos])

  const triggerFinishReel = () => {
    const p = reelProgressRef.current
    const bp = bitePosRef.current
    if (phaseRef.current !== 'reel') return
    if (p >= 100) {
      setLastResult({ success: false, lost: true })
      setPhase('result')
    } else if (p > 0 && Math.abs(p - bp) <= 10) {
      const result = castFishing(selectedSpot.id, selectedTime, selectedSeason, selectedWeather)
      if (result && result.success) {
        const catchResult = catchFish(result.fish, selectedSpot.id)
        setLastResult({ ...result, catch: catchResult })
      } else {
        setLastResult({ success: false, fish: result?.fish })
      }
      setPhase('result')
    } else if (p === 0) {
      setLastResult({ success: false, escaped: true })
      setPhase('result')
    }
  }

  // 自動 reel 流失 if 沒 tap
  useEffect(() => {
    if (phase !== 'reel') return
    const interval = setInterval(() => {
      setReelProgress(p => {
        const newP = Math.max(0, p - 0.5)
        const bp = bitePosRef.current
        // 流失時 hit 到目標範圍就 trigger finish
        if (phaseRef.current === 'reel' && bp > 0 && newP > 0 && Math.abs(newP - bp) <= 10) {
          setTimeout(() => {
            // 再 check 一次，仍然 in range 先 finish
            if (Math.abs(reelProgressRef.current - bitePosRef.current) <= 10 &&
                reelProgressRef.current > 0 &&
                reelProgressRef.current < 100 &&
                phaseRef.current === 'reel') {
              triggerFinishReel()
            }
          }, 50)
        }
        return newP
      })
    }, 100)
    return () => clearInterval(interval)
  }, [phase])

  const reset = () => {
    setPhase('list')
    setSelectedSpot(null)
    setLastResult(null)
  }

  if (phase === 'list') {
    return (
      <Layout title="去釣魚" onBack={onBack}>
        <div className="px-4 py-4 space-y-3">
          <div className="text-ocean-200 text-sm mb-2">選擇一個釣點開始</div>
          {FISHING_SPOTS.map(spot => {
            const unlocked = isSpotUnlocked(spot.id)
            return (
              <button
                key={spot.id}
                disabled={!unlocked}
                onClick={() => {
                  setSelectedSpot(spot)
                  setPhase('prep')
                }}
                className={`w-full rounded-2xl overflow-hidden shadow-lg relative ${
                  unlocked ? 'active:scale-95' : 'opacity-50'
                } transition-transform`}
              >
                {/* 真實相 background */}
                <div className="relative h-32">
                  <img
                    src={`${import.meta.env.BASE_URL}spots/${spot.id}.jpg`}
                    alt={spot.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                    <div className="text-2xl">{spot.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-bold text-base text-shadow">{spot.name}</div>
                      <div className="text-white/80 text-xs">{spot.region}</div>
                    </div>
                    {unlocked ? <div className="text-white text-xl">›</div> : <div className="text-xl">🔒</div>}
                  </div>
                </div>
                {!unlocked && (
                  <div className="bg-slate-800 text-slate-300 text-xs py-1.5 px-4">
                    {spot.unlockRequirement.type === 'fish_count' &&
                      `需釣到 ${spot.unlockRequirement.value} 條魚`}
                    {spot.unlockRequirement.type === 'rod_level' &&
                      `需升級釣竿至 Lv.${spot.unlockRequirement.value}`}
                  </div>
                )}
                {unlocked && (
                  <div className="bg-ocean-900/90 text-ocean-200 text-xs py-1.5 px-4 text-left">
                    {spot.description}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </Layout>
    )
  }

  if (phase === 'prep') {
    return (
      <Layout title={selectedSpot.name} onBack={() => setPhase('list')}>
        <div className={`bg-gradient-to-br ${selectedSpot.bgGradient} px-4 py-6`}>
          <div className="text-center text-white">
            <div className="text-5xl mb-2">{selectedSpot.icon}</div>
            <div className="text-xl font-bold text-shadow">{selectedSpot.name}</div>
            <div className="text-white/80 text-sm">{selectedSpot.description}</div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-5">
          {/* 時段 */}
          <div>
            <div className="text-ocean-200 text-sm mb-2">🕐 選擇時段</div>
            <div className="grid grid-cols-4 gap-2">
              {TIMES_OF_DAY.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTime(t.id)}
                  className={`rounded-xl p-2 text-center transition-all ${
                    selectedTime === t.id
                      ? `bg-gradient-to-b ${t.color} text-white scale-105 shadow-lg`
                      : 'bg-ocean-700 text-ocean-300'
                  }`}
                >
                  <div className="text-xl">{t.icon}</div>
                  <div className="text-xs mt-1">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 季節 */}
          <div>
            <div className="text-ocean-200 text-sm mb-2">🌸 季節</div>
            <div className="grid grid-cols-4 gap-2">
              {SEASONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`rounded-xl p-2 text-center transition-all ${
                    selectedSeason === s.id
                      ? 'bg-emerald-500 text-white scale-105 shadow-lg'
                      : 'bg-ocean-700 text-ocean-300'
                  }`}
                >
                  <div className="text-xl">{s.icon}</div>
                  <div className="text-xs mt-1">{s.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 天氣 */}
          <div>
            <div className="text-ocean-200 text-sm mb-2">🌤 天氣</div>
            <div className="grid grid-cols-3 gap-2">
              {WEATHERS.map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeather(w.id)}
                  className={`rounded-xl p-2 text-center transition-all ${
                    selectedWeather === w.id
                      ? 'bg-amber-500 text-white scale-105 shadow-lg'
                      : 'bg-ocean-700 text-ocean-300'
                  }`}
                >
                  <div className="text-xl">{w.icon}</div>
                  <div className="text-xs mt-1">{w.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startCast}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold py-4 rounded-2xl shadow-lg active:scale-95"
          >
            🎣 開始拋竿
          </button>
        </div>
      </Layout>
    )
  }

  if (phase === 'cast') {
    return (
      <Layout title={selectedSpot.name} onBack={() => setPhase('prep')}>
        <FishingScene spot={selectedSpot} phase="cast" castPower={castPower}>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-white text-lg text-shadow mb-4">
              {castCharging ? '蓄力中...鬆手拋竿！' : '拋出！'}
            </div>
            <div className="w-full max-w-xs bg-white/20 rounded-full h-6 overflow-hidden backdrop-blur mb-2">
              <div
                className={`h-full transition-all ${
                  castPower > 80 ? 'bg-red-400' : castPower > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${castPower}%` }}
              />
            </div>
            <div className="text-white text-2xl font-bold mb-4">{castPower}%</div>
            <button
              onMouseDown={startCast}
              onMouseUp={stopCast}
              onTouchStart={startCast}
              onTouchEnd={stopCast}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xl font-bold shadow-2xl active:scale-95"
            >
              按住
              <div className="text-sm font-normal">拋竿</div>
            </button>
          </div>
        </FishingScene>
      </Layout>
    )
  }

  if (phase === 'wait') {
    return (
      <Layout title={selectedSpot.name}>
        <FishingScene spot={selectedSpot} phase="wait" castPower={castPower}>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-white text-lg text-shadow mb-6">等待魚訊...</div>
            <div className="text-white/80 text-sm">拋竿力度: {castPower}%</div>
          </div>
        </FishingScene>
      </Layout>
    )
  }

  if (phase === 'reel') {
    const success = reelProgress >= bitePos - 10 && reelProgress <= bitePos + 10
    return (
      <Layout title={selectedSpot.name}>
        <FishingScene spot={selectedSpot} phase="reel" castPower={castPower} bitePos={bitePos} reelProgress={reelProgress}>
          <div className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
            <div className="text-white text-lg text-shadow mb-3 animate-pulse">⚡ 魚訊！收線！</div>

            {/* 進度條 */}
            <div className="relative w-full max-w-xs mb-4">
              <div className="w-full bg-white/30 rounded-full h-7 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    success ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${reelProgress}%` }}
                />
                <div
                  className="absolute top-0 h-7 border-2 border-emerald-300 rounded"
                  style={{
                    left: `${bitePos - 10}%`,
                    width: '20%',
                    background: 'rgba(16, 185, 129, 0.3)',
                  }}
                />
              </div>
              <div className="text-white text-center text-xs mt-1">
                {reelProgress.toFixed(0)}% / 目標 {bitePos}%
              </div>
            </div>

            <button
              onClick={reelTap}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-red-500 text-white text-xl font-bold shadow-2xl active:scale-95 animate-pulse"
            >
              收線！
            </button>
            <div className="text-white/80 text-xs mt-3">撳愈多次愈快收線</div>
          </div>
        </FishingScene>
      </Layout>
    )
  }

  if (phase === 'result') {
    return (
      <Layout title={selectedSpot.name} onBack={reset}>
        <FishingScene spot={selectedSpot} phase="result">
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-black/40">
            {lastResult.success ? (
              <>
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <div className="text-white text-2xl font-bold text-shadow mb-3">釣到啦！</div>
                {lastResult.fish.image && (
                  <div className="mb-4 w-32 h-24 bg-white/10 rounded-xl p-2 backdrop-blur">
                    <img src={lastResult.fish.image} alt={lastResult.fish.name} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="bg-white/95 rounded-2xl p-5 text-slate-800 shadow-2xl max-w-xs w-full">
                  <div className="text-center text-2xl font-bold mb-1">{lastResult.fish.name}</div>
                  <div className="text-center text-xs text-slate-500 mb-3">{lastResult.fish.nameEn}</div>
                  <div className="text-xs text-slate-700 bg-slate-100 rounded-lg p-2 mb-3">
                    {lastResult.fish.desc}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-amber-100 rounded-lg p-2">
                      <div className="text-xs text-amber-700">得分</div>
                      <div className="text-base font-bold text-amber-900">+{lastResult.catch.pointsGained}</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-2">
                      <div className="text-xs text-blue-700">經驗</div>
                      <div className="text-base font-bold text-blue-900">+{lastResult.catch.xpGained.toFixed(0)}</div>
                    </div>
                  </div>
                  {lastResult.catch.isNew && (
                    <div className="mt-3 text-center bg-emerald-500 text-white text-xs font-bold rounded-lg p-1.5">
                      ✨ 首次釣到新魚種！
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">😢</div>
                <div className="text-white text-2xl font-bold text-shadow mb-2">
                  {lastResult.escaped ? '魚走咗！' : lastResult.lost ? '甩魚！' : '無魚獲'}
                </div>
                <div className="text-white/80 text-sm">再接再厲！</div>
              </>
            )}

            <div className="mt-6 w-full max-w-xs space-y-2">
              <button
                onClick={() => {
                  setLastResult(null)
                  setPhase('prep')
                }}
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95"
              >
                🎣 再釣一次
              </button>
              <button
                onClick={reset}
                className="w-full bg-ocean-700 text-white py-3 rounded-xl active:scale-95"
              >
                返回釣點列表
              </button>
            </div>
          </div>
        </FishingScene>
      </Layout>
    )
  }

  return null
}