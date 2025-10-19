import { Design } from '@/types/design'
import LZString from 'lz-string'

/**
 * デザインを共有コードに変換
 */
export function encodeShareCode(design: Design): string {
  const json = JSON.stringify(design)
  const compressed = LZString.compressToBase64(json)
  return compressed
}

/**
 * 共有コードをデザインに復元
 */
export function decodeShareCode(code: string): Design | null {
  try {
    const decompressed = LZString.decompressFromBase64(code)
    if (!decompressed) return null
    const design = JSON.parse(decompressed) as Design
    return design
  } catch (error) {
    console.error('Failed to decode share code:', error)
    return null
  }
}

/**
 * デザインをJSON文字列にエクスポート
 */
export function exportJSON(design: Design): string {
  return JSON.stringify(design, null, 2)
}

/**
 * JSONファイルをダウンロード
 */
export function downloadJSON(design: Design, filename?: string): void {
  const json = exportJSON(design)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${design.title || 'design'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
