import { Design, DesignElement, PricingRates } from '@/types/design'

/**
 * デザインの価格を計算
 */
export function calcPrice(design: Design, rates: PricingRates): number {
  let total = rates.baseBagCost

  // 材料費（バッグ本体の面積）
  const bagAreaMM2 = design.widthMM * design.heightMM
  total += bagAreaMM2 * rates.materialRatePerMM2

  // 要素ごとの追加コスト
  design.elements.forEach(element => {
    // Shadow Itemは価格計算に含めない
    if (element.type === 'shadow_item') return

    // 金具
    if (element.type === 'hardware') {
      total += rates.hardwareRatePerPoint
      return
    }

    // その他の要素は複雑度コストのみ
    total += rates.complexityFactorPerElement
  })

  return Math.round(total)
}

/**
 * 要素の面積を計算（mm²）
 */
export function calcElementArea(element: DesignElement): number {
  if (element.rMM) {
    // 円形
    return Math.PI * element.rMM * element.rMM
  } else if (element.wMM && element.hMM) {
    // 矩形
    return element.wMM * element.hMM
  }
  return 0
}

/**
 * BOM（部品表）の生成
 */
export interface BOMItem {
  type: string
  count: number
  totalArea?: number
  unitCost?: number
  totalCost: number
}

export function generateBOM(design: Design, rates: PricingRates): BOMItem[] {
  const bom: BOMItem[] = []

  // バッグ本体
  const bagArea = design.widthMM * design.heightMM
  bom.push({
    type: 'バッグ本体',
    count: 1,
    totalArea: bagArea,
    unitCost: rates.baseBagCost + bagArea * rates.materialRatePerMM2,
    totalCost: rates.baseBagCost + bagArea * rates.materialRatePerMM2,
  })

  // 要素をタイプごとに集計
  const elementCounts: Record<string, number> = {}
  let hardwareCount = 0

  design.elements.forEach(element => {
    if (element.type === 'shadow_item') return

    if (element.type === 'hardware') {
      hardwareCount++
    } else {
      elementCounts[element.type] = (elementCounts[element.type] || 0) + 1
    }
  })

  // 要素タイプごとにBOMに追加
  Object.entries(elementCounts).forEach(([type, count]) => {
    const typeName =
      type === 'window'
        ? 'クリア窓'
        : type === 'pocket'
        ? 'ポケット'
        : type === 'badge_panel'
        ? 'バッジパネル'
        : type
    bom.push({
      type: typeName,
      count,
      totalCost: count * rates.complexityFactorPerElement,
    })
  })

  // 金具
  if (hardwareCount > 0) {
    bom.push({
      type: '金具',
      count: hardwareCount,
      unitCost: rates.hardwareRatePerPoint,
      totalCost: hardwareCount * rates.hardwareRatePerPoint,
    })
  }

  return bom
}
