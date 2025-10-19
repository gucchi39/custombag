import { PricingRates } from '@/types/design'

// 価格計算の定数
export const PRICING_RATES: PricingRates = {
  baseBagCost: 3500, // 基本バッグコスト（円）
  materialRatePerMM2: 0.08, // 材料コスト（円/mm²）= 8円/cm²
  hardwareRatePerPoint: 120, // 金具コスト（円/点）
  complexityFactorPerElement: 20, // 複雑度係数（円/要素）
}

// その他の設定
export const CONFIG = {
  defaultSeamMM: 10, // デフォルト縫い代（mm）
  snapGridMM: 5, // スナップグリッド（mm）
  minBagWidthMM: 200,
  maxBagWidthMM: 500,
  minBagHeightMM: 200,
  maxBagHeightMM: 600,
  canvasZoom: {
    min: 0.25,
    max: 3,
    default: 1,
  },
  undoLimit: 10, // Undo/Redoの履歴上限
  autoSaveInterval: 3000, // 自動保存間隔（ms）
}

// バッグカラーオプション
export const BAG_COLORS = [
  { id: 'white', name: '白', hex: '#FFFFFF' },
  { id: 'black', name: '黒', hex: '#000000' },
  { id: 'beige', name: 'ベージュ', hex: '#F5F5DC' },
  { id: 'navy', name: 'ネイビー', hex: '#000080' },
  { id: 'pink', name: 'ピンク', hex: '#FFB6C1' },
  { id: 'gray', name: 'グレー', hex: '#808080' },
]

// バッグタイプ
export const BAG_TYPES = [
  {
    id: 'tote' as const,
    name: 'トートバッグ',
    defaultWidth: 350,
    defaultHeight: 400,
    description: '縦型で収納力抜群',
  },
  {
    id: 'shoulder' as const,
    name: 'ショルダーバッグ',
    defaultWidth: 300,
    defaultHeight: 250,
    description: '横型でコンパクト',
  },
]
