import React from 'react'
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva'
import { useDesignStore } from '@/state/designStore'
import { CONFIG } from '@/config/pricing'
import Konva from 'konva'
import { isInSeamArea } from '@/modules/collision/detector'
import { packBadges } from '@/modules/pack/badgePacker'

interface BagCanvasProps {
  stageRef: React.MutableRefObject<Konva.Stage | null>
}

export function BagCanvas({ stageRef }: BagCanvasProps) {
  const {
    currentDesign,
    zoom,
    showGrid,
    selectedElementId,
    selectElement,
    updateElement,
  } = useDesignStore()

  if (!currentDesign) return null

  const { widthMM, heightMM, seamMM, elements } = currentDesign

  // キャンバスのサイズを画面に合わせて動的に計算
  const padding = 100
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 700 : 1200
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 800
  
  // バッグのサイズに基づいてスケールを計算
  const scaleX = (maxWidth - padding * 2) / widthMM
  const scaleY = (maxHeight - padding * 2) / heightMM
  const autoScale = Math.min(scaleX, scaleY, 1.5) * zoom
  
  const stageWidth = widthMM * autoScale + padding * 2
  const stageHeight = heightMM * autoScale + padding * 2
  const offsetX = padding
  const offsetY = padding

  const handleElementDragMove = (_id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    let x = node.x()
    let y = node.y()

    // スナップ
    const snapGrid = CONFIG.snapGridMM
    x = Math.round(x / snapGrid) * snapGrid
    y = Math.round(y / snapGrid) * snapGrid

    node.x(x)
    node.y(y)
  }

  const handleElementDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    updateElement(id, {
      xMM: node.x(),
      yMM: node.y(),
    })
  }

  // バッグの色を暗くする関数（3D効果用）
  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)))
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent)))
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent)))
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <Stage
          width={stageWidth}
          height={stageHeight}
          ref={stageRef}
          onClick={e => {
            if (e.target === e.target.getStage()) {
              selectElement(null)
            }
          }}
        >
          <Layer
            x={offsetX}
            y={offsetY}
            scaleX={autoScale}
            scaleY={autoScale}
          >
          {/* グリッド */}
          {showGrid && (
            <>
              {Array.from({ length: Math.ceil(widthMM / 10) }).map((_, i) => (
                <Line
                  key={`grid-v-${i}`}
                  points={[i * 10, 0, i * 10, heightMM]}
                  stroke="#e0e0e0"
                  strokeWidth={0.5}
                  listening={false}
                />
              ))}
              {Array.from({ length: Math.ceil(heightMM / 10) }).map((_, i) => (
                <Line
                  key={`grid-h-${i}`}
                  points={[0, i * 10, widthMM, i * 10]}
                  stroke="#e0e0e0"
                  strokeWidth={0.5}
                  listening={false}
                />
              ))}
            </>
          )}

          {/* バッグの影（立体感） */}
          <Rect
            x={8}
            y={8}
            width={widthMM}
            height={heightMM}
            fill="rgba(0, 0, 0, 0.15)"
            cornerRadius={5}
            listening={false}
          />

          {/* 3D効果: 右側面（奥行き） */}
          <Line
            points={[
              widthMM, 0,
              widthMM + 20, -15,
              widthMM + 20, heightMM - 15,
              widthMM, heightMM,
            ]}
            fill={darkenColor(currentDesign.color, 0.3)}
            fillAfterStrokeEnabled={true}
            stroke="#1a1a1a"
            strokeWidth={2}
            closed={true}
            listening={false}
          />

          {/* 3D効果: 底面（奥行き） */}
          <Line
            points={[
              0, heightMM,
              20, heightMM - 15,
              widthMM + 20, heightMM - 15,
              widthMM, heightMM,
            ]}
            fill={darkenColor(currentDesign.color, 0.4)}
            fillAfterStrokeEnabled={true}
            stroke="#1a1a1a"
            strokeWidth={2}
            closed={true}
            listening={false}
          />

          {/* バッグ本体（正面） */}
          <Rect
            x={0}
            y={0}
            width={widthMM}
            height={heightMM}
            fill={currentDesign.color}
            stroke="#2c2c2c"
            strokeWidth={3}
            cornerRadius={5}
            shadowColor="rgba(0, 0, 0, 0.2)"
            shadowBlur={10}
            shadowOffsetX={2}
            shadowOffsetY={2}
            listening={false}
          />

          {/* 持ち手（ハンドル） */}
          {currentDesign.bagType === 'tote' && (
            <>
              {/* 左の持ち手 */}
              <Line
                points={[
                  widthMM * 0.3, -5,
                  widthMM * 0.3, -30,
                  widthMM * 0.4, -40,
                  widthMM * 0.4, -30,
                  widthMM * 0.4, -5,
                ]}
                stroke="#2c2c2c"
                strokeWidth={8}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
              {/* 右の持ち手 */}
              <Line
                points={[
                  widthMM * 0.6, -5,
                  widthMM * 0.6, -30,
                  widthMM * 0.7, -40,
                  widthMM * 0.7, -30,
                  widthMM * 0.7, -5,
                ]}
                stroke="#2c2c2c"
                strokeWidth={8}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            </>
          )}

          {/* ショルダーストラップ */}
          {currentDesign.bagType === 'shoulder' && (
            <Line
              points={[
                widthMM * 0.85, 20,
                widthMM * 0.95, -20,
                widthMM * 1.05, -40,
              ]}
              stroke="#2c2c2c"
              strokeWidth={6}
              lineCap="round"
              listening={false}
            />
          )}

          {/* ステッチ（縫い目）装飾 */}
          <Rect
            x={5}
            y={5}
            width={widthMM - 10}
            height={heightMM - 10}
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
            dash={[8, 4]}
            cornerRadius={3}
            listening={false}
          />

          {/* 縫い代ガイド */}
          <Rect
            x={seamMM}
            y={seamMM}
            width={widthMM - seamMM * 2}
            height={heightMM - seamMM * 2}
            stroke="#ff6b6b"
            strokeWidth={1}
            dash={[5, 5]}
            listening={false}
          />

          {/* 要素 */}
          {elements.map(element => {
            const isSelected = selectedElementId === element.id
            const inSeamArea = isInSeamArea(element, widthMM, heightMM, seamMM)

            return (
              <React.Fragment key={element.id}>
                {element.type === 'window' && element.props.shape === 'rectangle' && (
                  <Rect
                    x={element.xMM}
                    y={element.yMM}
                    width={element.wMM || 0}
                    height={element.hMM || 0}
                    fill={`rgba(173, 216, 230, ${element.props.transparency || 0.8})`}
                    stroke={isSelected ? '#4a90e2' : inSeamArea ? '#ff0000' : '#666'}
                    strokeWidth={isSelected ? 3 : inSeamArea ? 2 : 1}
                    cornerRadius={element.props.cornerRadius || 0}
                    draggable
                    onDragMove={e => handleElementDragMove(element.id, e)}
                    onDragEnd={e => handleElementDragEnd(element.id, e)}
                    onClick={() => selectElement(element.id)}
                  />
                )}

                {element.type === 'window' && element.props.shape === 'circle' && (
                  <Circle
                    x={element.xMM}
                    y={element.yMM}
                    radius={element.rMM || 0}
                    fill={`rgba(173, 216, 230, ${element.props.transparency || 0.8})`}
                    stroke={isSelected ? '#4a90e2' : inSeamArea ? '#ff0000' : '#666'}
                    strokeWidth={isSelected ? 3 : inSeamArea ? 2 : 1}
                    draggable
                    onDragMove={e => handleElementDragMove(element.id, e)}
                    onDragEnd={e => handleElementDragEnd(element.id, e)}
                    onClick={() => selectElement(element.id)}
                  />
                )}

                {element.type === 'pocket' && (
                  <>
                    <Rect
                      x={element.xMM}
                      y={element.yMM}
                      width={element.wMM || 0}
                      height={element.hMM || 0}
                      fill={element.props.style === 'zipper' ? '#f0e68c' : '#fffacd'}
                      stroke={isSelected ? '#4a90e2' : inSeamArea ? '#ff0000' : '#666'}
                      strokeWidth={isSelected ? 3 : inSeamArea ? 2 : 1}
                      draggable
                      onDragMove={e => handleElementDragMove(element.id, e)}
                      onDragEnd={e => handleElementDragEnd(element.id, e)}
                      onClick={() => selectElement(element.id)}
                    />
                    {element.props.style === 'zipper' && (
                      <Line
                        points={[
                          element.xMM,
                          element.yMM,
                          element.xMM + (element.wMM || 0),
                          element.yMM,
                        ]}
                        stroke="#666"
                        strokeWidth={2}
                        listening={false}
                      />
                    )}
                  </>
                )}

                {element.type === 'badge_panel' && (
                  <>
                    <Rect
                      x={element.xMM}
                      y={element.yMM}
                      width={element.wMM || 0}
                      height={element.hMM || 0}
                      fill="rgba(255, 240, 245, 0.7)"
                      stroke={isSelected ? '#4a90e2' : inSeamArea ? '#ff0000' : '#e91e63'}
                      strokeWidth={isSelected ? 3 : inSeamArea ? 2 : 1}
                      draggable
                      onDragMove={e => handleElementDragMove(element.id, e)}
                      onDragEnd={e => handleElementDragEnd(element.id, e)}
                      onClick={() => selectElement(element.id)}
                    />
                    {/* 缶バッジガイド */}
                    {element.wMM && element.hMM && (
                      <>
                        {packBadges(
                          element.wMM,
                          element.hMM,
                          element.props.badgeSize || 57,
                          element.props.gap || 10
                        ).map((pos, idx) => (
                          <Circle
                            key={`badge-${element.id}-${idx}`}
                            x={element.xMM + pos.x}
                            y={element.yMM + pos.y}
                            radius={(element.props.badgeSize || 57) / 2}
                            stroke="#e91e63"
                            strokeWidth={1}
                            dash={[3, 3]}
                            listening={false}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}

                {element.type === 'hardware' && (
                  <>
                    <Rect
                      x={element.xMM}
                      y={element.yMM}
                      width={element.wMM || 20}
                      height={element.hMM || 20}
                      fill="#c0c0c0"
                      stroke={isSelected ? '#4a90e2' : inSeamArea ? '#ff0000' : '#666'}
                      strokeWidth={isSelected ? 3 : inSeamArea ? 2 : 1}
                      draggable
                      onDragMove={e => handleElementDragMove(element.id, e)}
                      onDragEnd={e => handleElementDragEnd(element.id, e)}
                      onClick={() => selectElement(element.id)}
                    />
                  </>
                )}

                {element.type === 'shadow_item' && (
                  <>
                    {element.props.isCircle ? (
                      <Circle
                        x={element.xMM}
                        y={element.yMM}
                        radius={(element.props.diameter || element.rMM || 50) / 2}
                        fill="rgba(0, 0, 0, 0.2)"
                        stroke={isSelected ? '#4a90e2' : '#00ff00'}
                        strokeWidth={isSelected ? 3 : 2}
                        draggable
                        onDragMove={e => handleElementDragMove(element.id, e)}
                        onDragEnd={e => handleElementDragEnd(element.id, e)}
                        onClick={() => selectElement(element.id)}
                      />
                    ) : (
                      <Rect
                        x={element.xMM}
                        y={element.yMM}
                        width={element.wMM || 0}
                        height={element.hMM || 0}
                        fill="rgba(0, 0, 0, 0.2)"
                        stroke={isSelected ? '#4a90e2' : '#00ff00'}
                        strokeWidth={isSelected ? 3 : 2}
                        draggable
                        onDragMove={e => handleElementDragMove(element.id, e)}
                        onDragEnd={e => handleElementDragEnd(element.id, e)}
                        onClick={() => selectElement(element.id)}
                      />
                    )}
                    <Text
                      x={element.xMM}
                      y={element.yMM - 20}
                      text={element.props.itemName || ''}
                      fontSize={12}
                      fill="#333"
                      listening={false}
                    />
                  </>
                )}
              </React.Fragment>
            )
          })}
        </Layer>
        </Stage>
      </div>
    </div>
  )
}
