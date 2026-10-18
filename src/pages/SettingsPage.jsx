import Layout from '../components/Layout'
import { useGameStore } from '../store/gameStore'

export default function SettingsPage({ onBack }) {
  const { points, level, totalFishCaught, codex, currentRodLevel, resetGame, isCodexComplete } = useGameStore()

  return (
    <Layout title="設定" onBack={onBack}>
      <div className="px-4 py-4 space-y-3">
        <div className="bg-ocean-700 rounded-2xl p-4">
          <div className="text-ocean-100 font-bold mb-2">📊 遊戲統計</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-ocean-800 rounded-lg p-2 text-center">
              <div className="text-ocean-300 text-xs">等級</div>
              <div className="text-white text-xl font-bold">{level}</div>
            </div>
            <div className="bg-ocean-800 rounded-lg p-2 text-center">
              <div className="text-ocean-300 text-xs">積分</div>
              <div className="text-amber-300 text-xl font-bold">{points}</div>
            </div>
            <div className="bg-ocean-800 rounded-lg p-2 text-center">
              <div className="text-ocean-300 text-xs">總釣獲</div>
              <div className="text-white text-xl font-bold">{totalFishCaught}</div>
            </div>
            <div className="bg-ocean-800 rounded-lg p-2 text-center">
              <div className="text-ocean-300 text-xs">圖鑑</div>
              <div className="text-emerald-300 text-xl font-bold">{Object.keys(codex).length}/30</div>
            </div>
            <div className="bg-ocean-800 rounded-lg p-2 text-center col-span-2">
              <div className="text-ocean-300 text-xs">當前魚竿</div>
              <div className="text-white text-base font-bold">Lv.{currentRodLevel}</div>
            </div>
          </div>
        </div>

        <div className="bg-ocean-700 rounded-2xl p-4">
          <div className="text-ocean-100 font-bold mb-2">ℹ️ 關於</div>
          <div className="text-ocean-200 text-sm space-y-1">
            <div>🎣 釣遊香港 v0.1 MVP</div>
            <div>📍 30 種香港魚 · 5 個釣點</div>
            <div>💾 自動保存進度</div>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('確定要重置所有進度？')) resetGame()
          }}
          className="w-full bg-red-500/20 border border-red-400 text-red-300 font-bold py-3 rounded-xl"
        >
          ⚠️ 重置遊戲進度
        </button>
      </div>
    </Layout>
  )
}