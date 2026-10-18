import { useState } from 'react'
import Layout from '../components/Layout'
import FishArt from '../components/FishArt'
import { useGameStore } from '../store/gameStore'
import { FISH_SPECIES } from '../data/fish'
import { FISH_TANKS } from '../data/equipment'

export default function RoomPage({ onBack }) {
  const { tankFish, currentTankLevel, removeFishFromTank, addFishToTank, codex, points, ownedTanks, buyTank } = useGameStore()
  const [showTankShop, setShowTankShop] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [selectedFish, setSelectedFish] = useState(null)

  const tank = FISH_TANKS.find(t => t.level === currentTankLevel)
  const ownedFishIds = Object.keys(codex)

  const getFishById = id => FISH_SPECIES.find(f => f.id === id)

  // 魚缸入面嘅魚
  const tankFishData = tankFish.map(id => getFishById(id)).filter(Boolean)

  // 每隻魚 random animation class
  const animClass = ['animate-swim1', 'animate-swim2', 'animate-swim3', 'animate-bob']

  if (showTankShop) {
    return (
      <Layout title="魚缸店" onBack={() => setShowTankShop(false)}>
        <div className="px-4 py-4 space-y-3">
          {FISH_TANKS.map(t => {
            const owned = ownedTanks.includes(t.level)
            const canBuy = points >= t.price && !owned
            const isCurrent = t.level === currentTankLevel
            return (
              <div
                key={t.level}
                className={`bg-gradient-to-r ${
                  isCurrent ? 'from-emerald-500 to-green-600' :
                  owned ? 'from-ocean-600 to-ocean-700' :
                  canBuy ? 'from-purple-500 to-fuchsia-600' :
                  'from-slate-600 to-slate-700'
                } rounded-2xl p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{t.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-bold">Lv.{t.level} {t.name}</div>
                    <div className="text-white/80 text-xs">{t.description}</div>
                    <div className="text-white/80 text-xs mt-1">容量: {t.capacity} 條</div>
                  </div>
                  {isCurrent ? (
                    <div className="text-white text-sm font-bold bg-white/20 px-3 py-1 rounded-full">使用中</div>
                  ) : owned ? (
                    <button
                      onClick={() => {}}
                      className="text-white text-sm bg-white/20 px-3 py-1 rounded-full"
                      disabled
                    >
                      已擁有
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (canBuy) buyTank(t.level)
                      }}
                      disabled={!canBuy}
                      className={`text-sm font-bold px-4 py-2 rounded-full ${
                        canBuy ? 'bg-amber-400 text-amber-900 active:scale-95' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      💰 {t.price}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Layout>
    )
  }

  if (showManage) {
    return (
      <Layout title="管理魚缸" onBack={() => setShowManage(false)}>
        <div className="px-4 py-4">
          <div className="bg-ocean-700 rounded-xl p-3 mb-4 text-sm text-ocean-100">
            點擊魚加入 / 移出魚缸 ({tankFish.length}/{tank.capacity})
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ownedFishIds.map(fid => {
              const fish = getFishById(fid)
              if (!fish) return null
              const inTank = tankFish.includes(fid)
              const canAdd = !inTank && tankFish.length < tank.capacity
              return (
                <button
                  key={fid}
                  onClick={() => {
                    if (inTank) {
                      removeFishFromTank(fid)
                    } else if (canAdd) {
                      addFishToTank(fid)
                    }
                  }}
                  disabled={!inTank && !canAdd}
                  className={`p-3 rounded-xl border-2 ${
                    inTank ? 'bg-emerald-500 border-emerald-300' :
                    canAdd ? 'bg-ocean-700 border-ocean-400' :
                    'bg-ocean-800 border-ocean-700 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">🐟</div>
                  <div className="text-xs text-white truncate">{fish.name}</div>
                  <div className="text-xs text-white/60">
                    {inTank ? '✓' : canAdd ? '+' : '滿'}
                  </div>
                </button>
              )
            })}
          </div>
          {ownedFishIds.length === 0 && (
            <div className="text-center text-ocean-300 mt-8">未釣過任何魚</div>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="我嘅房" onBack={onBack}>
      <div className="relative h-[calc(100vh-180px)] overflow-hidden">
        {/* 房間背景 — 木地板 + 海景窗 */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300">
          {/* 海景窗 */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-sky-300 to-sky-500 border-b-8 border-amber-700">
            <div className="absolute inset-4 border-4 border-amber-700 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-sky-400 via-sky-300 to-blue-400 relative">
                {/* 海浪 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-blue-500">
                  <div className="absolute top-2 left-0 right-0 h-2 bg-white/40 rounded-full animate-pulse"></div>
                </div>
                {/* 太陽 */}
                <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
          {/* 木地板 */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-700 to-amber-900">
            <div className="grid grid-cols-6 gap-1 h-full p-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-amber-800 rounded border border-amber-950"></div>
              ))}
            </div>
          </div>
        </div>

        {/* 魚缸 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4">
          <div
            className="relative bg-gradient-to-b from-cyan-400/40 via-blue-500/50 to-blue-700/60 border-8 border-amber-700 rounded-3xl overflow-hidden shadow-2xl"
            style={{ width: tank.width * 1.5, height: tank.height * 1.5 }}
          >
            {/* 水面波紋 */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/30 to-transparent"></div>
            {/* 底砂 */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
            {/* 水草 */}
            <div className="absolute bottom-4 left-8 text-3xl">🌿</div>
            <div className="absolute bottom-4 right-8 text-3xl">🌿</div>

            {/* 魚 */}
            {tankFishData.map((fish, i) => {
              const anim = animClass[i % animClass.length]
              return (
                <button
                  key={fish.id + i}
                  onClick={() => setSelectedFish(fish)}
                  className="absolute cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    top: `${20 + (i % 3) * 30}%`,
                    left: `${(i * 23) % 80}%`,
                  }}
                >
                  <FishArt fish={fish} animationClass={anim} size={50} />
                </button>
              )
            })}

            {/* 空提示 */}
            {tankFishData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/60 text-sm text-center px-4">
                  魚缸空嘅<br/>
                  去釣魚收集！
                </div>
              </div>
            )}

            {/* 容量顯示 */}
            <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
              {tankFish.length}/{tank.capacity}
            </div>
          </div>
          <div className="text-center mt-2 text-amber-900 text-sm font-bold">{tank.icon} {tank.name}</div>
        </div>

        {/* 魚詳情 modal */}
        {selectedFish && (
          <div
            className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-40"
            onClick={() => setSelectedFish(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-xs w-full text-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center mb-3">
                <FishArt fish={selectedFish} animationClass="animate-bob" size={100} />
              </div>
              <div className="text-center text-2xl font-bold">{selectedFish.name}</div>
              <div className="text-center text-sm text-slate-500 mb-3">{selectedFish.nameEn}</div>
              <div className="text-sm bg-slate-100 rounded-lg p-3 mb-3">{selectedFish.desc}</div>
              <div className="text-xs text-slate-500 mb-1">
                共釣到 <span className="font-bold text-slate-700">{codex[selectedFish.id]?.count || 0}</span> 條
              </div>
              <button
                onClick={() => setSelectedFish(null)}
                className="w-full mt-2 bg-ocean-500 text-white py-2 rounded-lg"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ocean-900 to-transparent">
        <div className="flex gap-2">
          <button
            onClick={() => setShowManage(true)}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg"
          >
            管理魚缸
          </button>
          <button
            onClick={() => setShowTankShop(true)}
            className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-bold shadow-lg"
          >
            魚缸店
          </button>
        </div>
      </div>
    </Layout>
  )
}