import { useGameStore } from '../store/gameStore'
import { FISHING_SPOTS } from '../data/spots'

export default function MainMenu({ onNavigate }) {
  const { totalFishCaught, codex, isSpotUnlocked } = useGameStore()
  const ownedFish = Object.keys(codex).length

  const menuItems = [
    {
      id: 'fish',
      icon: '🎣',
      title: '去釣魚',
      subtitle: `已釣 ${totalFishCaught} 條 · 解鎖 ${FISHING_SPOTS.filter(s => isSpotUnlocked(s.id)).length}/${FISHING_SPOTS.length} 釣點`,
      gradient: 'from-ocean-500 to-ocean-700',
    },
    {
      id: 'room',
      icon: '🏠',
      title: '我嘅房',
      subtitle: '睇吓你嘅魚缸',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'codex',
      icon: '📖',
      title: '魚種圖鑑',
      subtitle: `已收集 ${ownedFish}/30 種`,
      gradient: 'from-emerald-500 to-green-700',
    },
    {
      id: 'shop',
      icon: '🛒',
      title: '釣具店',
      subtitle: '升級釣竿同魚缸',
      gradient: 'from-purple-500 to-fuchsia-700',
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: '設定',
      subtitle: '重置 / 關於',
      gradient: 'from-slate-500 to-slate-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900 flex flex-col">
      {/* Hero */}
      <div className="relative px-6 pt-8 pb-6 text-center">
        <div className="text-6xl mb-2 animate-float">🎣</div>
        <h1 className="text-3xl font-bold text-white text-shadow">釣遊香港</h1>
        <p className="text-ocean-200 text-sm mt-1">HK Fishing Quest</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-ocean-700/60 border border-ocean-400/30 rounded-full px-4 py-1.5 text-sm text-ocean-100">
          <span>📊</span>
          <span>Lv.{useGameStore.getState().level}</span>
          <span className="text-ocean-300">·</span>
          <span>💰 {useGameStore.getState().points}</span>
          <span className="text-ocean-300">·</span>
          <span>🐟 {ownedFish}</span>
        </div>
      </div>

      {/* Menu grid */}
      <div className="flex-1 px-4 pb-6 space-y-3">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full bg-gradient-to-r ${item.gradient} rounded-2xl p-4 shadow-lg active:scale-95 transition-transform`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1 text-left">
                <div className="text-white font-bold text-lg text-shadow">{item.title}</div>
                <div className="text-white/80 text-xs">{item.subtitle}</div>
              </div>
              <div className="text-white/60 text-2xl">›</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-ocean-300 text-xs pb-4">
        v0.1 · MVP Prototype
      </div>
    </div>
  )
}