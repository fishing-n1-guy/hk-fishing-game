import { useGameStore } from '../store/gameStore'

export default function Header({ title, onBack, rightAction }) {
  const { level, points } = useGameStore()
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-b from-ocean-900 to-ocean-800 px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-ocean-700 hover:bg-ocean-600 flex items-center justify-center text-white text-lg"
            >
              ←
            </button>
          )}
          <div>
            <div className="text-white text-lg font-bold text-shadow">{title}</div>
            <div className="text-ocean-200 text-xs">Lv.{level}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 border border-amber-400/50 rounded-full px-3 py-1 text-amber-200 text-sm font-bold flex items-center gap-1">
            💰 {points}
          </div>
          {rightAction}
        </div>
      </div>
    </div>
  )
}