import React from 'react'
import { useDesignStore } from '@/state/designStore'
import { ITEM_LIBRARY, ELEMENT_DEFAULTS } from '@/data/items'
import { DesignElement } from '@/types/design'

export function LeftPanel() {
  const { currentDesign, addElement } = useDesignStore()

  console.log('LeftPanel rendering, currentDesign:', currentDesign)

  if (!currentDesign) {
    console.log('LeftPanel: No design, returning null')
    return null
  }

  const handleAddWindow = (shape: 'rectangle' | 'circle') => {
    const defaults = ELEMENT_DEFAULTS.window[shape]
    const element: DesignElement = {
      id: `elem-${Date.now()}`,
      type: 'window',
      xMM: 50,
      yMM: 50,
      ...(shape === 'circle' ? { rMM: defaults.rMM } : { wMM: defaults.wMM, hMM: defaults.hMM }),
      props: defaults.props,
      zIndex: currentDesign.elements.length,
    }
    addElement(element)
  }

  const handleAddPocket = () => {
    const defaults = ELEMENT_DEFAULTS.pocket
    const element: DesignElement = {
      id: `elem-${Date.now()}`,
      type: 'pocket',
      xMM: 50,
      yMM: 50,
      wMM: defaults.wMM,
      hMM: defaults.hMM,
      props: defaults.props,
      zIndex: currentDesign.elements.length,
    }
    addElement(element)
  }

  const handleAddBadgePanel = () => {
    const defaults = ELEMENT_DEFAULTS.badge_panel
    const element: DesignElement = {
      id: `elem-${Date.now()}`,
      type: 'badge_panel',
      xMM: 50,
      yMM: 50,
      wMM: defaults.wMM,
      hMM: defaults.hMM,
      props: defaults.props,
      zIndex: currentDesign.elements.length,
    }
    addElement(element)
  }

  const handleAddHardware = () => {
    const defaults = ELEMENT_DEFAULTS.hardware
    const element: DesignElement = {
      id: `elem-${Date.now()}`,
      type: 'hardware',
      xMM: 50,
      yMM: 50,
      wMM: defaults.wMM,
      hMM: defaults.hMM,
      props: defaults.props,
      zIndex: currentDesign.elements.length,
    }
    addElement(element)
  }

  const handleAddShadowItem = (item: typeof ITEM_LIBRARY[0]) => {
    const element: DesignElement = {
      id: `elem-${Date.now()}`,
      type: 'shadow_item',
      xMM: 50,
      yMM: 50,
      wMM: item.widthMM,
      hMM: item.heightMM,
      rMM: item.diameterMM ? item.diameterMM / 2 : undefined,
      props: {
        itemName: item.name,
        isCircle: !!item.diameterMM,
        diameter: item.diameterMM,
      },
      zIndex: currentDesign.elements.length,
    }
    addElement(element)
  }

  return (
    <div className="p-4 space-y-6">
      <section>
        <h3 className="font-bold text-sm mb-3 text-gray-700">クリア窓</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleAddWindow('rectangle')}
            className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-sm transition-colors"
          >
            □ 矩形窓
          </button>
          <button
            onClick={() => handleAddWindow('circle')}
            className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-sm transition-colors"
          >
            ○ 円形窓
          </button>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3 text-gray-700">ポケット</h3>
        <button
          onClick={handleAddPocket}
          className="w-full px-3 py-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded text-sm transition-colors"
        >
          ポケットを追加
        </button>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3 text-gray-700">バッジパネル</h3>
        <button
          onClick={handleAddBadgePanel}
          className="w-full px-3 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded text-sm transition-colors"
        >
          バッジパネルを追加
        </button>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3 text-gray-700">金具</h3>
        <button
          onClick={handleAddHardware}
          className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-sm transition-colors"
        >
          金具を追加
        </button>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3 text-gray-700">持ち物（フィットチェック）</h3>
        <div className="space-y-2">
          {ITEM_LIBRARY.map(item => (
            <button
              key={item.id}
              onClick={() => handleAddShadowItem(item)}
              className="w-full px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-sm text-left transition-colors"
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
