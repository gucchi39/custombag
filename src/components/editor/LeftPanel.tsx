import React, { useState } from 'react'
import { useDesignStore } from '@/state/designStore'
import { ITEM_LIBRARY, ELEMENT_DEFAULTS } from '@/data/items'
import { DesignElement } from '@/types/design'

type Tab = 'windows' | 'pockets' | 'badges' | 'hardware' | 'items'

export function LeftPanel() {
  const { currentDesign, addElement } = useDesignStore()
  const [activeTab, setActiveTab] = useState<Tab>('windows')

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
    <div className="flex flex-col h-full">
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('windows')}
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
            activeTab === 'windows'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          🪟 窓
        </button>
        <button
          onClick={() => setActiveTab('pockets')}
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
            activeTab === 'pockets'
              ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          👜 機能
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
            activeTab === 'items'
              ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          📦 持ち物
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'windows' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm mb-3 text-gray-700">クリア窓を追加</h3>
            <button
              onClick={() => handleAddWindow('rectangle')}
              className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-sm font-medium transition-colors"
            >
              □ 矩形窓
            </button>
            <button
              onClick={() => handleAddWindow('circle')}
              className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-sm font-medium transition-colors"
            >
              ○ 円形窓
            </button>
          </div>
        )}

        {activeTab === 'pockets' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm mb-3 text-gray-700">機能を追加</h3>
            <button
              onClick={handleAddPocket}
              className="w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg text-sm font-medium transition-colors"
            >
              👜 ポケット
            </button>
            <button
              onClick={handleAddBadgePanel}
              className="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 rounded-lg text-sm font-medium transition-colors"
            >
              🎀 バッジパネル
            </button>
            <button
              onClick={handleAddHardware}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              🔧 金具
            </button>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-2">
            <h3 className="font-bold text-sm mb-3 text-gray-700">持ち物（フィットチェック）</h3>
            <p className="text-xs text-gray-500 mb-3">
              持ち物を配置してサイズ感を確認できます
            </p>
            {ITEM_LIBRARY.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddShadowItem(item)}
                className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg text-sm font-medium text-left transition-colors flex items-center gap-2"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
