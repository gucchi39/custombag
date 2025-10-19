// デザイン全体の型定義
export interface Design {
  id: string
  title: string
  bagType: 'tote' | 'shoulder'
  color: string
  widthMM: number
  heightMM: number
  seamMM: number // 縫い代
  elements: DesignElement[]
  priceJPY: number
  createdAt: number
  updatedAt: number
  // SNS機能用
  isPublic?: boolean // 公開設定
  authorName?: string // 投稿者名
  description?: string // バッグの説明
  tags?: string[] // タグ（#推し名など）
  likes?: number // いいね数
  comments?: Comment[] // コメント
  views?: number // 閲覧数
}

// コメントの型
export interface Comment {
  id: string
  authorName: string
  text: string
  createdAt: number
  likes?: number
}

// デザイン要素の型
export interface DesignElement {
  id: string
  type: 'window' | 'pocket' | 'badge_panel' | 'hardware' | 'shadow_item'
  xMM: number
  yMM: number
  wMM?: number // 幅（円形の場合は直径）
  hMM?: number // 高さ
  rMM?: number // 半径（円形用）
  props: Record<string, any>
  zIndex: number
}

// 要素タイプ別のプロパティ
export interface WindowProps {
  shape: 'rectangle' | 'circle'
  cornerRadius?: number // 角丸（矩形のみ）
  transparency: number // 0-1
}

export interface PocketProps {
  style: 'zipper' | 'open'
  depth?: number // マチ（v2）
}

export interface BadgePanelProps {
  badgeSize: 57 | 75 // mm
  gap: number // 缶バッジ間隔
}

export interface HardwareProps {
  hardwareType: 'd-ring' | 'snap-hook' | 'button'
}

export interface ShadowItemProps {
  itemName: string
  isCircle?: boolean
  diameter?: number
}

// アイテムライブラリの型
export interface LibraryItem {
  id: string
  name: string
  category: 'goods' | 'accessories'
  widthMM?: number
  heightMM?: number
  diameterMM?: number
  handleLengthMM?: number // うちわの柄
  icon?: string
}

// バッグタイプの型
export interface BagType {
  id: 'tote' | 'shoulder'
  name: string
  defaultWidth: number
  defaultHeight: number
  description: string
}

// 価格レートの型
export interface PricingRates {
  baseBagCost: number
  materialRatePerMM2: number // 円/mm²
  hardwareRatePerPoint: number // 円/点
  complexityFactorPerElement: number // 円/要素
}

// エクスポート設定の型
export interface ExportSettings {
  format: 'png' | 'pdf' | 'json'
  scale?: number // PNG用
  includeGuides?: boolean
}

// 履歴の型（Undo/Redo用）
export interface HistoryState {
  past: Design[]
  present: Design
  future: Design[]
}
