import { useDesignStore } from '@/state/designStore'
import { BAG_COLORS, BAG_TYPES } from '@/config/pricing'
import { Button } from '@/components/ui/Button'

export function RightPanel() {
  const {
    currentDesign,
    selectedElementId,
    updateDesign,
    updateElement,
    removeElement,
    duplicateElement,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
  } = useDesignStore()

  if (!currentDesign) return null

  const selectedElement = currentDesign.elements.find(el => el.id === selectedElementId)

  const handleBagWidthChange = (value: number) => {
    updateDesign({ widthMM: value })
  }

  const handleBagHeightChange = (value: number) => {
    updateDesign({ heightMM: value })
  }

  const handleColorChange = (color: string) => {
    updateDesign({ color })
  }

  const handleBagTypeChange = (bagType: 'tote' | 'shoulder') => {
    const type = BAG_TYPES.find(t => t.id === bagType)
    if (type) {
      updateDesign({
        bagType,
        widthMM: type.defaultWidth,
        heightMM: type.defaultHeight,
      })
    }
  }

  const handleElementPropertyChange = (key: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [key]: value })
    }
  }

  const handleElementPropsChange = (key: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        props: { ...selectedElement.props, [key]: value },
      })
    }
  }

  return (
    <div className="p-4 space-y-6 text-sm">
      {/* バッグ設定 */}
      <section>
        <h3 className="font-bold mb-3">バッグ設定</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600 mb-1">タイプ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={currentDesign.bagType}
              onChange={e => handleBagTypeChange(e.target.value as 'tote' | 'shoulder')}
            >
              {BAG_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">幅 (mm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={currentDesign.widthMM}
              onChange={e => handleBagWidthChange(Number(e.target.value))}
              min={200}
              max={500}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">高さ (mm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={currentDesign.heightMM}
              onChange={e => handleBagHeightChange(Number(e.target.value))}
              min={200}
              max={600}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">カラー</label>
            <div className="grid grid-cols-4 gap-2">
              {BAG_COLORS.map(color => (
                <button
                  key={color.id}
                  className="w-10 h-10 rounded border-2 transition-all"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: currentDesign.color === color.hex ? '#4a90e2' : '#ccc',
                  }}
                  onClick={() => handleColorChange(color.hex)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">縫い代 (mm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={currentDesign.seamMM}
              onChange={e => updateDesign({ seamMM: Number(e.target.value) })}
              min={5}
              max={20}
            />
          </div>
        </div>
      </section>

      {/* 表示設定 */}
      <section>
        <h3 className="font-bold mb-3">表示設定</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600 mb-1">ズーム</label>
            <input
              type="range"
              className="w-full"
              min={0.25}
              max={3}
              step={0.25}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
            />
            <div className="text-center text-gray-500">{Math.round(zoom * 100)}%</div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
              className="w-4 h-4"
            />
            <span>グリッドを表示</span>
          </label>
        </div>
      </section>

      {/* 選択要素のプロパティ */}
      {selectedElement && (
        <section className="border-t pt-4">
          <h3 className="font-bold mb-3">選択要素</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">X位置 (mm)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={Math.round(selectedElement.xMM)}
                onChange={e => handleElementPropertyChange('xMM', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Y位置 (mm)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={Math.round(selectedElement.yMM)}
                onChange={e => handleElementPropertyChange('yMM', Number(e.target.value))}
              />
            </div>

            {selectedElement.wMM !== undefined && (
              <div>
                <label className="block text-gray-600 mb-1">幅 (mm)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={Math.round(selectedElement.wMM)}
                  onChange={e => handleElementPropertyChange('wMM', Number(e.target.value))}
                />
              </div>
            )}

            {selectedElement.hMM !== undefined && (
              <div>
                <label className="block text-gray-600 mb-1">高さ (mm)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={Math.round(selectedElement.hMM)}
                  onChange={e => handleElementPropertyChange('hMM', Number(e.target.value))}
                />
              </div>
            )}

            {selectedElement.rMM !== undefined && (
              <div>
                <label className="block text-gray-600 mb-1">半径 (mm)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={Math.round(selectedElement.rMM)}
                  onChange={e => handleElementPropertyChange('rMM', Number(e.target.value))}
                />
              </div>
            )}

            {selectedElement.type === 'badge_panel' && (
              <>
                <div>
                  <label className="block text-gray-600 mb-1">缶バッジサイズ (mm)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedElement.props.badgeSize || 57}
                    onChange={e => handleElementPropsChange('badgeSize', Number(e.target.value))}
                  >
                    <option value={57}>57mm</option>
                    <option value={75}>75mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">間隔 (mm)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedElement.props.gap || 10}
                    onChange={e => handleElementPropsChange('gap', Number(e.target.value))}
                    min={5}
                    max={30}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => duplicateElement(selectedElement.id)}
              >
                複製
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="flex-1"
                onClick={() => removeElement(selectedElement.id)}
              >
                削除
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 価格表示 */}
      <section className="border-t pt-4">
        <h3 className="font-bold mb-3">概算見積</h3>
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">
            ¥{currentDesign.priceJPY.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">税込（想定）</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※実際の製造価格とは異なる場合があります
        </p>
      </section>
    </div>
  )
}
