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

  return (
    <div className="flex items-center justify-center w-full h-full p-8">
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

          {/* バッグ本体 */}
          <Rect
            x={0}
            y={0}
            width={widthMM}
            height={heightMM}
            fill={currentDesign.color}
            stroke="#333"
            strokeWidth={2}
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
  )
}
