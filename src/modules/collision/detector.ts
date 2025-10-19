import { DesignElement } from '@/types/design'

/**
 * 矩形の定義
 */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 2つの要素が重なっているかチェック（縫い代考慮）
 */
export function isOverlap(a: DesignElement, b: DesignElement, seamMM: number = 0): boolean {
  const rectA = getElementRect(a)
  const rectB = getElementRect(b)

  if (!rectA || !rectB) return false

  // 縫い代分だけ拡大
  const expandedA = {
    x: rectA.x - seamMM,
    y: rectA.y - seamMM,
    width: rectA.width + seamMM * 2,
    height: rectA.height + seamMM * 2,
  }

  const expandedB = {
    x: rectB.x - seamMM,
    y: rectB.y - seamMM,
    width: rectB.width + seamMM * 2,
    height: rectB.height + seamMM * 2,
  }

  return rectsOverlap(expandedA, expandedB)
}

/**
 * 2つの矩形が重なっているか
 */
function rectsOverlap(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  )
}

/**
 * 要素から矩形を取得
 */
function getElementRect(element: DesignElement): Rect | null {
  if (element.rMM) {
    // 円形
    const diameter = element.rMM * 2
    return {
      x: element.xMM - element.rMM,
      y: element.yMM - element.rMM,
      width: diameter,
      height: diameter,
    }
  } else if (element.wMM && element.hMM) {
    // 矩形
    return {
      x: element.xMM,
      y: element.yMM,
      width: element.wMM,
      height: element.hMM,
    }
  }
  return null
}

/**
 * 要素がバッグの縫い代エリアに侵入しているかチェック
 */
export function isInSeamArea(
  element: DesignElement,
  bagWidth: number,
  bagHeight: number,
  seamMM: number
): boolean {
  const rect = getElementRect(element)
  if (!rect) return false

  // 縫い代エリアの内側の矩形
  const safeArea = {
    x: seamMM,
    y: seamMM,
    width: bagWidth - seamMM * 2,
    height: bagHeight - seamMM * 2,
  }

  // 要素が完全にsafeArea内にあればOK
  return !(
    rect.x >= safeArea.x &&
    rect.y >= safeArea.y &&
    rect.x + rect.width <= safeArea.x + safeArea.width &&
    rect.y + rect.height <= safeArea.y + safeArea.height
  )
}

/**
 * フィットチェック: コンテナに収まるか
 */
export function fitCheck(
  containerRect: Rect,
  itemWidth: number,
  itemHeight: number
): boolean {
  return itemWidth <= containerRect.width && itemHeight <= containerRect.height
}
