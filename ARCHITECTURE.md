# アーキテクチャドキュメント

## 📁 ディレクトリ構造

```
src/
├── components/          # UIコンポーネント
│   ├── canvas/         # Konva関連（BagCanvas等）
│   ├── editor/         # エディタパネル（LeftPanel, RightPanel）
│   ├── layout/         # レイアウト（Header）
│   └── ui/             # 汎用UI（Button, Card, Toast）
├── config/             # 設定ファイル（pricing.ts）
├── data/               # マスターデータ（items.ts, seeds.ts）
├── modules/            # ビジネスロジック
│   ├── collision/     # 当たり判定（detector.ts）
│   ├── pack/          # 缶バッジ配置（badgePacker.ts）
│   └── price/         # 価格計算（calculator.ts）
├── pages/              # ページコンポーネント
│   ├── HomePage.tsx   # ホーム画面
│   ├── DesignPage.tsx # エディタ画面
│   └── GalleryPage.tsx # ギャラリー画面
├── state/              # Zustand状態管理
│   ├── designStore.ts  # デザイン状態
│   ├── galleryStore.ts # ギャラリー状態
│   └── toastStore.ts   # トースト通知
├── tests/              # テストファイル
│   ├── e2e/           # Playwrightテスト
│   └── *.test.ts      # Vitestユニットテスト
├── types/              # TypeScript型定義
│   └── design.ts      # デザイン関連の型
├── utils/              # ユーティリティ
│   └── export/        # エクスポート機能（PNG/PDF/JSON/共有コード）
├── index.css          # グローバルCSS
└── main.tsx           # エントリーポイント
```

## 🏗️ 技術スタック

### フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite**: 高速ビルドツール
- **React Router**: ルーティング

### 状態管理
- **Zustand**: シンプルで軽量な状態管理
  - `designStore`: 現在のデザイン、選択要素、Undo/Redo
  - `galleryStore`: 保存されたデザイン一覧
  - `toastStore`: 通知メッセージ

### UIレンダリング
- **Tailwind CSS**: ユーティリティファーストCSS
- **Konva.js + react-konva**: 2Dキャンバス描画

### エクスポート
- **jsPDF**: PDF生成
- **html2canvas**: HTMLをCanvasに変換（将来的な拡張用）
- **lz-string**: 共有コードの圧縮

### テスト
- **Vitest**: ユニットテスト
- **Playwright**: E2Eテスト

## 🔄 データフロー

### 1. デザイン作成フロー
```
HomePage (プリセット選択)
  ↓
designStore.setDesign()
  ↓
DesignPage (エディタ表示)
  ↓
要素追加・編集 → designStore.addElement/updateElement
  ↓
BagCanvas (Konvaで描画)
```

### 2. 保存・共有フロー
```
DesignPage
  ↓
[保存ボタン] → galleryStore.saveDesign() → LocalStorage
  ↓
[共有コード] → encodeShareCode() → クリップボード
  ↓
GalleryPage (読み込み) → decodeShareCode() → designStore.setDesign()
```

### 3. 価格計算フロー
```
デザイン変更
  ↓
designStore.recalculatePrice()
  ↓
calcPrice(design, rates)
  ↓
design.priceJPY更新
  ↓
RightPanel (表示)
```

## 🎨 キャンバスの座標系

- **単位**: mm（ミリメートル）
- **内部表現**: 1px = 1mm として扱う
- **ズーム**: scaleX/scaleYで視覚的なスケール変更
- **スナップ**: 5mm単位でグリッドスナップ

### 要素の配置
- `xMM`, `yMM`: 左上座標
- `wMM`, `hMM`: 幅・高さ（矩形）
- `rMM`: 半径（円形）
- `zIndex`: 重なり順

## 💾 LocalStorageの構造

```typescript
// キー: "oshi_bag_designs"
// 値: Design[]の配列

[
  {
    id: "design-1234567890",
    title: "新しいデザイン",
    bagType: "tote",
    color: "#FFFFFF",
    widthMM: 350,
    heightMM: 400,
    seamMM: 10,
    elements: [...],
    priceJPY: 5280,
    createdAt: 1234567890000,
    updatedAt: 1234567890000
  },
  ...
]
```

## 🔐 共有コードの仕組み

1. **エンコード**:
   ```typescript
   Design → JSON.stringify() → LZString.compressToBase64() → Base64文字列
   ```

2. **デコード**:
   ```typescript
   Base64文字列 → LZString.decompressFromBase64() → JSON.parse() → Design
   ```

## 🧪 テスト戦略

### ユニットテスト（Vitest）
- `price.test.ts`: 価格計算ロジック
- `collision.test.ts`: 当たり判定
- `badgePacker.test.ts`: 缶バッジ配置

### E2Eテスト（Playwright）
- `basic.spec.ts`: 基本フロー（作成→保存→リロード）
- 共有コードのインポート/エクスポート
- ファイルダウンロード機能

## 🚀 パフォーマンス最適化

### 実装済み
- Konvaのイベントハンドリング最適化
- Zustandの部分購読（必要な状態のみ取得）
- 自動保存のデバウンス（3秒）

### 将来的な改善案
- 大量要素のための仮想化
- Web Workerでの重い計算の移譲
- Service Workerによるオフライン対応

## 🔮 拡張可能性

このプロトタイプは以下の拡張が容易です：

1. **バックエンド連携**: デザインJSONをAPIに送信
2. **画像アップロード**: ロゴや写真の配置
3. **3Dプレビュー**: Three.jsでの立体表示
4. **AI機能**: 最適なレイアウト提案
5. **コラボ編集**: WebSocketでリアルタイム共同編集
6. **決済連携**: Stripeなどでの注文・決済機能
