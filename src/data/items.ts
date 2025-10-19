import { LibraryItem } from '@/types/design'

// アイテムライブラリ（持ち物データベース）
export const ITEM_LIBRARY: LibraryItem[] = [
  {
    id: 'uchiwa_jumbo',
    name: 'うちわ（ジャンボ）',
    category: 'goods',
    diameterMM: 295,
    handleLengthMM: 120,
    icon: '🪭',
  },
  {
    id: 'badge_57',
    name: '缶バッジ(57mm)',
    category: 'goods',
    diameterMM: 57,
    icon: '⭕',
  },
  {
    id: 'badge_75',
    name: '缶バッジ(75mm)',
    category: 'goods',
    diameterMM: 75,
    icon: '🔵',
  },
  {
    id: 'trading_card',
    name: 'トレカ',
    category: 'goods',
    widthMM: 63,
    heightMM: 88,
    icon: '🃏',
  },
  {
    id: 'acrylic_stand_m',
    name: 'アクリルスタンド(中)',
    category: 'goods',
    widthMM: 50,
    heightMM: 100,
    icon: '🎭',
  },
  {
    id: 'penlight',
    name: 'ペンライト(汎用)',
    category: 'goods',
    widthMM: 40,
    heightMM: 250,
    icon: '🔦',
  },
  {
    id: 'mobile_battery_s',
    name: 'モバイルバッテリー(小)',
    category: 'goods',
    widthMM: 70,
    heightMM: 140,
    icon: '🔋',
  },
  {
    id: 'muffler_towel',
    name: 'マフラータオル（畳み）',
    category: 'goods',
    widthMM: 120,
    heightMM: 200,
    icon: '🧣',
  },
]

// 要素タイプのデフォルト設定
export const ELEMENT_DEFAULTS = {
  window: {
    rectangle: {
      wMM: 150,
      hMM: 150,
      props: {
        shape: 'rectangle',
        cornerRadius: 10,
        transparency: 0.8,
      },
    },
    circle: {
      rMM: 75,
      props: {
        shape: 'circle',
        transparency: 0.8,
      },
    },
  },
  pocket: {
    wMM: 120,
    hMM: 150,
    props: {
      style: 'zipper',
    },
  },
  badge_panel: {
    wMM: 200,
    hMM: 200,
    props: {
      badgeSize: 57,
      gap: 10,
    },
  },
  hardware: {
    wMM: 20,
    hMM: 20,
    props: {
      hardwareType: 'd-ring',
    },
  },
}
