import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FISH_SPECIES } from '../data/fish'
import { FISHING_SPOTS, getFishPoolForSpot } from '../data/spots'
import { RODS, FISH_TANKS } from '../data/equipment'

const STARTER_STATE = {
  // 玩家資料
  playerName: '釣手',
  level: 1,
  xp: 0,

  // 經濟
  points: 30, // 起始積分

  // 釣具
  currentRodLevel: 1,
  ownedRods: [1],
  currentTankLevel: 1,
  ownedTanks: [1],

  // 圖鑑 — { fishId: { count, firstCaughtAt } }
  codex: {},

  // 魚缸內容 — 魚 id list（每釣到新魚會彈出 prompt：加入魚缸？）
  tankFish: [],

  // 進度
  totalFishCaught: 0,

  // 設定
  sound: true,

  // 房間佈置 (V2)
  roomDecor: [],
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...STARTER_STATE,

      // ===== 釣魚 =====

      // 嘗試釣魚 — 根據地點、時段、釣具、天氣 計算魚獲
      castFishing: (spotId, timeOfDay, season, weather) => {
        const { currentRodLevel } = get()
        const rod = RODS.find(r => r.level === currentRodLevel)
        const spot = FISHING_SPOTS.find(s => s.id === spotId)
        if (!spot || !rod) return null

        // 計算魚池
        const pool = getFishPoolForSpot(spotId, FISH_SPECIES)

        // 篩選符合時段、季節
        const eligible = pool.filter(f => {
          const timeMatch = f.timeOfDay.includes(timeOfDay)
          const seasonMatch = f.seasons.includes(season)
          return timeMatch && seasonMatch
        })

        if (eligible.length === 0) {
          // fallback — 返 common
          return { fish: pool[0] || FISH_SPECIES[0], success: false }
        }

        // 加權 random — rare魚種機率低
        const weights = eligible.map(f => {
          const rarityMod = 1 / (f.rarity * f.rarity)
          const catchMod = (rod.catchPower / f.rarity) * 0.5
          const weatherMod = weather === 'rainy' ? 1.1 : 1.0
          return Math.max(0.05, rarityMod * weatherMod + catchMod)
        })
        const total = weights.reduce((a, b) => a + b, 0)
        let r = Math.random() * total
        let chosen = eligible[0]
        for (let i = 0; i < eligible.length; i++) {
          r -= weights[i]
          if (r <= 0) {
            chosen = eligible[i]
            break
          }
        }

        // 80% 機率釣到，否則甩
        const success = Math.random() < 0.8

        return { fish: chosen, success }
      },

      // 成功釣到魚
      catchFish: (fish, spotId) => {
        const { codex, totalFishCaught, points, xp } = get()

        const newCount = (codex[fish.id]?.count || 0) + 1
        const isNew = !codex[fish.id]

        const newCodex = {
          ...codex,
          [fish.id]: {
            count: newCount,
            firstCaughtAt: codex[fish.id]?.firstCaughtAt || Date.now(),
            spotId,
          },
        }

        const pointsGained = fish.points + (isNew ? 50 : 0) // 首次 bonus
        const xpGained = fish.points * 0.5 + (isNew ? 20 : 0)

        const newTotal = totalFishCaught + 1
        // 每 100 xp 升 1 級
        const newXp = xp + xpGained
        const newLevel = Math.floor(newXp / 100) + 1

        set({
          codex: newCodex,
          totalFishCaught: newTotal,
          points: points + pointsGained,
          xp: newXp,
          level: newLevel,
        })

        return { isNew, pointsGained, xpGained }
      },

      // ===== 魚缸 =====
      addFishToTank: (fishId) => {
        const { tankFish, currentTankLevel } = get()
        const tank = FISH_TANKS.find(t => t.level === currentTankLevel)
        if (!tank) return false
        if (tankFish.length >= tank.capacity) return false
        if (tankFish.includes(fishId)) return false
        set({ tankFish: [...tankFish, fishId] })
        return true
      },

      removeFishFromTank: (fishId) => {
        const { tankFish } = get()
        set({ tankFish: tankFish.filter(id => id !== fishId) })
      },

      // ===== 釣具商店 =====
      buyRod: (level) => {
        const { points, ownedRods } = get()
        const rod = RODS.find(r => r.level === level)
        if (!rod || ownedRods.includes(level)) return { success: false, reason: 'already_owned' }
        if (points < rod.price) return { success: false, reason: 'insufficient_points' }
        set({
          points: points - rod.price,
          ownedRods: [...ownedRods, level],
        })
        return { success: true }
      },

      equipRod: (level) => {
        const { ownedRods } = get()
        if (!ownedRods.includes(level)) return false
        set({ currentRodLevel: level })
        return true
      },

      buyTank: (level) => {
        const { points, ownedTanks } = get()
        const tank = FISH_TANKS.find(t => t.level === level)
        if (!tank || ownedTanks.includes(level)) return { success: false, reason: 'already_owned' }
        if (points < tank.price) return { success: false, reason: 'insufficient_points' }
        set({
          points: points - tank.price,
          ownedTanks: [...ownedTanks, level],
          currentTankLevel: level,
        })
        return { success: true }
      },

      // ===== 重置 =====
      resetGame: () => set(STARTER_STATE),

      // ===== helpers =====
      isSpotUnlocked: (spotId) => {
        const { totalFishCaught, currentRodLevel, codex } = get()
        const spot = FISHING_SPOTS.find(s => s.id === spotId)
        if (!spot) return false
        const req = spot.unlockRequirement
        if (req.type === 'default') return true
        if (req.type === 'fish_count') return totalFishCaught >= req.value
        if (req.type === 'rod_level') return currentRodLevel >= req.value
        return false
      },

      getOwnedFishCount: () => Object.keys(get().codex).length,

      isCodexComplete: () => Object.keys(get().codex).length >= 30,
    }),
    {
      name: 'hk-fishing-game-save',
      version: 1,
    }
  )
)