import Layout from '../components/Layout'
import { useGameStore } from '../store/gameStore'
import { RODS } from '../data/equipment'

export default function ShopPage({ onBack }) {
  const { points, ownedRods, currentRodLevel, buyRod, equipRod } = useGameStore()

  return (
    <Layout title="釣具店" onBack={onBack}>
      <div className="px-4 py-4 space-y-3">
        <div className="bg-ocean-700 rounded-xl p-3 text-sm flex items-center justify-between">
          <div className="text-ocean-100">💰 積分</div>
          <div className="text-amber-300 font-bold text-lg">{points}</div>
        </div>

        <div className="text-ocean-200 text-sm">🎣 魚竿</div>

        {RODS.map(rod => {
          const owned = ownedRods.includes(rod.level)
          const canBuy = points >= rod.price && !owned
          const isCurrent = rod.level === currentRodLevel
          return (
            <div
              key={rod.level}
              className={`bg-gradient-to-r ${
                isCurrent ? 'from-emerald-500 to-green-600' :
                owned ? 'from-ocean-600 to-ocean-700' :
                canBuy ? 'from-purple-500 to-fuchsia-600' :
                'from-slate-600 to-slate-700'
              } rounded-2xl p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{rod.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-bold">
                    Lv.{rod.level} {rod.name}
                  </div>
                  <div className="text-white/80 text-xs">{rod.nameEn}</div>
                  <div className="text-white/90 text-xs mt-1">{rod.description}</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div className="bg-black/20 rounded p-1 text-center">
                      <div className="text-white/60">力量</div>
                      <div className="text-white font-bold">{rod.catchPower.toFixed(1)}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1 text-center">
                      <div className="text-white/60">靈敏</div>
                      <div className="text-white font-bold">{(rod.sensitivity * 100).toFixed(0)}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1 text-center">
                      <div className="text-white/60">承重</div>
                      <div className="text-white font-bold">{rod.maxWeight}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {isCurrent ? (
                  <div className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">使用中</div>
                ) : owned ? (
                  <button
                    onClick={() => equipRod(rod.level)}
                    className="bg-emerald-400 text-emerald-900 text-xs font-bold px-4 py-2 rounded-full active:scale-95"
                  >
                    裝備
                  </button>
                ) : (
                  <button
                    onClick={() => canBuy && buyRod(rod.level)}
                    disabled={!canBuy}
                    className={`text-xs font-bold px-4 py-2 rounded-full ${
                      canBuy ? 'bg-amber-400 text-amber-900 active:scale-95' : 'bg-white/10 text-white/40'
                    }`}
                  >
                    💰 {rod.price}
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