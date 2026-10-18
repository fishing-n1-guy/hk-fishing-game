import { useState } from 'react'
import Layout from '../components/Layout'
import FishArt from '../components/FishArt'
import { useGameStore } from '../store/gameStore'
import { FISH_SPECIES } from '../data/fish'
import { RARITY_INFO } from '../data/fish'

export default function CodexPage({ onBack }) {
  const { codex } = useGameStore()
  const [filter, setFilter] = useState('all')
  const [selectedFish, setSelectedFish] = useState(null)

  const ownedFishIds = Object.keys(codex)

  const filtered = FISH_SPECIES.filter(s => {
    if (filter === 'all') return true
    if (filter === 'owned') return ownedFishIds.includes(s.id)
    if (filter === 'unowned') return !ownedFishIds.includes(s.id)
    return s.rarity === parseInt(filter)
  })

  return (
    <Layout title="魚種圖鑑" onBack={onBack}>
      <div className="px-4 py-4">
        <div className="bg-ocean-700 rounded-xl p-3 mb-4 text-sm flex items-center justify-between">
          <div className="text-ocean-100">已收集</div>
          <div className="text-amber-300 font-bold text-lg">
            {ownedFishIds.length} / {FISH_SPECIES.length}
          </div>
        </div>

        {/* filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', name: '全部' },
            { id: 'owned', name: '已釣到' },
            { id: 'unowned', name: '未釣到' },
            { id: 1, name: '普通' },
            { id: 2, name: '少見' },
            { id: 3, name: '稀有' },
            { id: 4, name: '史詩' },
            { id: 5, name: '傳說' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                filter === f.id
                  ? 'bg-amber-400 text-amber-900'
                  : 'bg-ocean-700 text-ocean-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* grid */}
        <div className="grid grid-cols-3 gap-2">
          {filtered.map(fish => {
            const owned = ownedFishIds.includes(fish.id)
            const count = codex[fish.id]?.count || 0
            const rarity = RARITY_INFO[fish.rarity]
            return (
              <button
                key={fish.id}
                onClick={() => setSelectedFish(fish)}
                className={`p-2 rounded-xl border-2 ${
                  owned ? rarity.color : 'bg-ocean-800 border-ocean-700'
                }`}
              >
                <div className={`flex justify-center mb-1 ${owned ? '' : 'grayscale opacity-30'}`}>
                  <FishArt fish={fish} animationClass="animate-bob" size={50} />
                </div>
                <div className={`text-xs truncate ${owned ? '' : 'text-ocean-400'}`}>
                  {owned ? fish.name : '???'}
                </div>
                <div className="text-xs text-center">
                  {owned ? `${rarity.stars} ×${count}` : rarity.stars}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* detail modal */}
      {selectedFish && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedFish(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-xs w-full text-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <FishArt fish={selectedFish} animationClass="animate-bob" size={120} />
            </div>
            <div className="text-center text-2xl font-bold">{selectedFish.name}</div>
            <div className="text-center text-sm text-slate-500 mb-1">{selectedFish.nameEn}</div>
            <div className="text-center mb-3">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${RARITY_INFO[selectedFish.rarity].color}`}>
                {RARITY_INFO[selectedFish.rarity].stars} {RARITY_INFO[selectedFish.rarity].name}
              </span>
            </div>
            <div className="text-sm bg-slate-100 rounded-lg p-3 mb-3">
              {selectedFish.desc}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs mb-2">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-blue-700">釣點</div>
                <div className="text-blue-900 font-bold">{selectedFish.habitat.length} 個</div>
              </div>
              <div className="bg-amber-50 rounded p-2">
                <div className="text-amber-700">得分</div>
                <div className="text-amber-900 font-bold">{selectedFish.points}</div>
              </div>
            </div>
            {ownedFishIds.includes(selectedFish.id) && (
              <div className="text-center text-emerald-600 text-sm font-bold">
                ✓ 已釣到 ×{codex[selectedFish.id]?.count}
              </div>
            )}
            <button
              onClick={() => setSelectedFish(null)}
              className="w-full mt-3 bg-ocean-500 text-white py-2 rounded-lg"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}