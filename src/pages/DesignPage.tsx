import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDesignStore } from '@/state/designStore'
import { useGalleryStore } from '@/state/galleryStore'
import { useToastStore } from '@/state/toastStore'
import { Button } from '@/components/ui/Button'
import { BagCanvas } from '@/components/canvas/BagCanvas'
import { LeftPanel } from '@/components/editor/LeftPanel'
import { RightPanel } from '@/components/editor/RightPanel'
import { exportPNG } from '@/utils/export/png'
import { exportPDF } from '@/utils/export/pdf'
import { downloadJSON, encodeShareCode } from '@/utils/export/shareCode'
import Konva from 'konva'

export function DesignPage() {
  const navigate = useNavigate()
  const currentDesign = useDesignStore(state => state.currentDesign)
  const { undo, redo, canUndo, canRedo } = useDesignStore()
  const saveDesign = useGalleryStore(state => state.saveDesign)
  const showToast = useToastStore(state => state.show)
  const stageRef = useRef<Konva.Stage | null>(null)

  useEffect(() => {
    if (!currentDesign) {
      console.log('No design found, redirecting to home')
      navigate('/')
    } else {
      console.log('Design loaded:', currentDesign)
    }
  }, [currentDesign, navigate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo()) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  // 自動保存
  useEffect(() => {
    if (!currentDesign) return

    const timer = setTimeout(() => {
      saveDesign(currentDesign)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentDesign, saveDesign])

  if (!currentDesign) return null

  const handleSave = () => {
    if (currentDesign) {
      saveDesign(currentDesign)
      showToast('デザインを保存しました', 'success')
    }
  }

  const handleExportPNG = () => {
    if (stageRef.current && currentDesign) {
      exportPNG(stageRef.current, currentDesign)
      showToast('PNGをエクスポートしました', 'success')
    }
  }

  const handleExportPDF = async () => {
    if (currentDesign) {
      const dataURL = stageRef.current?.toDataURL({ pixelRatio: 2 })
      await exportPDF(currentDesign, dataURL)
      showToast('PDFをエクスポートしました', 'success')
    }
  }

  const handleExportJSON = () => {
    if (currentDesign) {
      downloadJSON(currentDesign)
      showToast('JSONをエクスポートしました', 'success')
    }
  }

  const handleCopyShareCode = () => {
    if (currentDesign) {
      const code = encodeShareCode(currentDesign)
      navigator.clipboard.writeText(code)
      showToast('共有コードをコピーしました', 'success')
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleSave}>
            💾 保存
          </Button>
          <Button size="sm" variant="ghost" onClick={undo} disabled={!canUndo()}>
            ↶
          </Button>
          <Button size="sm" variant="ghost" onClick={redo} disabled={!canRedo()}>
            ↷
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleExportPNG}>
            PNG
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportPDF}>
            PDF
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportJSON}>
            JSON
          </Button>
          <Button size="sm" variant="primary" onClick={handleCopyShareCode}>
            共有コード
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - アイテムライブラリ */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <LeftPanel />
        </div>

        {/* Center - キャンバス */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <BagCanvas stageRef={stageRef} />
        </div>

        {/* Right Panel - プロパティ & 見積 */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
