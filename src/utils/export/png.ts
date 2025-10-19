import { Design } from '@/types/design'
import Konva from 'konva'

/**
 * KonvaステージをPNG画像としてエクスポート
 */
export function exportPNG(stage: Konva.Stage, design: Design, scale = 2): void {
  const dataURL = stage.toDataURL({
    pixelRatio: scale,
    mimeType: 'image/png',
  })

  const link = document.createElement('a')
  link.download = `${design.title || 'design'}.png`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Konvaステージからデータ URL を取得
 */
export function getCanvasDataURL(stage: Konva.Stage, scale = 2): string {
  return stage.toDataURL({
    pixelRatio: scale,
    mimeType: 'image/png',
  })
}
