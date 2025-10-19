import { create } from 'zustand'
import { Design, DesignElement } from '@/types/design'
import { calcPrice } from '@/modules/price/calculator'
import { PRICING_RATES } from '@/config/pricing'

interface DesignState {
  currentDesign: Design | null
  selectedElementId: string | null
  zoom: number
  showGrid: boolean
  past: Design[]
  future: Design[]

  // Actions
  setDesign: (design: Design) => void
  updateDesign: (updates: Partial<Design>) => void
  addElement: (element: DesignElement) => void
  updateElement: (id: string, updates: Partial<DesignElement>) => void
  removeElement: (id: string) => void
  selectElement: (id: string | null) => void
  duplicateElement: (id: string) => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  recalculatePrice: () => void
}

const MAX_HISTORY = 10

export const useDesignStore = create<DesignState>((set, get) => ({
  currentDesign: null,
  selectedElementId: null,
  zoom: 1,
  showGrid: true,
  past: [],
  future: [],

  setDesign: (design: Design) => {
    set({
      currentDesign: design,
      selectedElementId: null,
      past: [],
      future: [],
    })
  },

  updateDesign: updates => {
    const { currentDesign, past } = get()
    if (!currentDesign) return

    const newDesign = { ...currentDesign, ...updates, updatedAt: Date.now() }
    const newPast = [...past, currentDesign].slice(-MAX_HISTORY)

    set({
      currentDesign: newDesign,
      past: newPast,
      future: [],
    })
    get().recalculatePrice()
  },

  addElement: element => {
    const { currentDesign, past } = get()
    if (!currentDesign) return

    const newDesign = {
      ...currentDesign,
      elements: [...currentDesign.elements, element],
      updatedAt: Date.now(),
    }
    const newPast = [...past, currentDesign].slice(-MAX_HISTORY)

    set({
      currentDesign: newDesign,
      past: newPast,
      future: [],
      selectedElementId: element.id,
    })
    get().recalculatePrice()
  },

  updateElement: (id, updates) => {
    const { currentDesign, past } = get()
    if (!currentDesign) return

    const newDesign = {
      ...currentDesign,
      elements: currentDesign.elements.map(el => (el.id === id ? { ...el, ...updates } : el)),
      updatedAt: Date.now(),
    }
    const newPast = [...past, currentDesign].slice(-MAX_HISTORY)

    set({
      currentDesign: newDesign,
      past: newPast,
      future: [],
    })
    get().recalculatePrice()
  },

  removeElement: id => {
    const { currentDesign, past, selectedElementId } = get()
    if (!currentDesign) return

    const newDesign = {
      ...currentDesign,
      elements: currentDesign.elements.filter(el => el.id !== id),
      updatedAt: Date.now(),
    }
    const newPast = [...past, currentDesign].slice(-MAX_HISTORY)

    set({
      currentDesign: newDesign,
      past: newPast,
      future: [],
      selectedElementId: selectedElementId === id ? null : selectedElementId,
    })
    get().recalculatePrice()
  },

  selectElement: id => {
    set({ selectedElementId: id })
  },

  duplicateElement: id => {
    const { currentDesign } = get()
    if (!currentDesign) return

    const element = currentDesign.elements.find(el => el.id === id)
    if (!element) return

    const newElement: DesignElement = {
      ...element,
      id: `elem-${Date.now()}`,
      xMM: element.xMM + 20,
      yMM: element.yMM + 20,
      zIndex: Math.max(...currentDesign.elements.map(e => e.zIndex), 0) + 1,
    }

    get().addElement(newElement)
  },

  setZoom: zoom => {
    set({ zoom })
  },

  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }))
  },

  undo: () => {
    const { past, currentDesign, future } = get()
    if (past.length === 0 || !currentDesign) return

    const previous = past[past.length - 1]
    const newPast = past.slice(0, -1)

    set({
      past: newPast,
      currentDesign: previous,
      future: [currentDesign, ...future].slice(0, MAX_HISTORY),
    })
  },

  redo: () => {
    const { future, currentDesign, past } = get()
    if (future.length === 0 || !currentDesign) return

    const next = future[0]
    const newFuture = future.slice(1)

    set({
      past: [...past, currentDesign].slice(-MAX_HISTORY),
      currentDesign: next,
      future: newFuture,
    })
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  recalculatePrice: () => {
    const { currentDesign } = get()
    if (!currentDesign) return

    const price = calcPrice(currentDesign, PRICING_RATES)
    set({
      currentDesign: {
        ...currentDesign,
        priceJPY: price,
      },
    })
  },
}))
