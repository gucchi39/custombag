import { create } from 'zustand'
import { Design } from '@/types/design'
import { SEED_DESIGNS } from '@/data/seeds'

const STORAGE_KEY = 'oshi_bag_designs'

interface GalleryState {
  designs: Design[]
  loadDesigns: () => void
  saveDesign: (design: Design) => void
  updateDesign: (id: string, updates: Partial<Design>) => void
  deleteDesign: (id: string) => void
  initializeSeeds: () => void
}

export const useGalleryStore = create<GalleryState>(set => ({
  designs: [],

  loadDesigns: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const designs = JSON.parse(stored) as Design[]
        // 公開投稿が1件もない場合はサンプルデータを追加
        const publicDesigns = designs.filter(d => d.isPublic === true)
        if (publicDesigns.length === 0) {
          // ユーザーのデザインとサンプルデザインをマージ
          const mergedDesigns = [...SEED_DESIGNS, ...designs]
          set({ designs: mergedDesigns })
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedDesigns))
        } else {
          set({ designs })
        }
      } else {
        // 初回起動時はSeedを投入
        set({ designs: [...SEED_DESIGNS] })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DESIGNS))
      }
    } catch (error) {
      console.error('Failed to load designs:', error)
      set({ designs: [] })
    }
  },

  saveDesign: design => {
    set(state => {
      const existingIndex = state.designs.findIndex(d => d.id === design.id)
      let newDesigns: Design[]

      if (existingIndex >= 0) {
        // 既存デザインを更新
        newDesigns = [...state.designs]
        newDesigns[existingIndex] = design
      } else {
        // 新規デザインを追加
        newDesigns = [design, ...state.designs]
      }

      // LocalStorageに保存
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDesigns))
      } catch (error) {
        console.error('Failed to save design:', error)
      }

      return { designs: newDesigns }
    })
  },

  updateDesign: (id, updates) => {
    set(state => {
      const newDesigns = state.designs.map(d =>
        d.id === id ? { ...d, ...updates } : d
      )

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDesigns))
      } catch (error) {
        console.error('Failed to update design:', error)
      }

      return { designs: newDesigns }
    })
  },

  deleteDesign: id => {
    set(state => {
      const newDesigns = state.designs.filter(d => d.id !== id)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDesigns))
      } catch (error) {
        console.error('Failed to delete design:', error)
      }

      return { designs: newDesigns }
    })
  },

  initializeSeeds: () => {
    set({ designs: [...SEED_DESIGNS] })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DESIGNS))
    } catch (error) {
      console.error('Failed to initialize seeds:', error)
    }
  },
}))
