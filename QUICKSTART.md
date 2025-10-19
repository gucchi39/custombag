# クイックスタートガイド

## 📦 セットアップ手順（初回のみ）

### 1. Node.jsのインストール確認

PowerShellまたはコマンドプロンプトで以下を実行：

```powershell
node -v
```

バージョンが表示されればOKです（例: v18.17.0）。

表示されない場合は[Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロードしてインストールしてください。

### 2. 依存関係のインストール

プロジェクトフォルダで以下を実行：

```powershell
npm install
```

### 3. 開発サーバーの起動

```powershell
npm run dev
```

### 4. ブラウザで確認

自動的にブラウザが開かない場合は、以下のURLにアクセス：

```
http://localhost:5173
```

## 🎉 使い方

1. **ホーム画面**: 「カスタムをはじめる」ボタンをクリック
2. **エディタ画面**: 
   - 左パネルから要素をクリックして追加
   - 中央のキャンバスでドラッグして配置
   - 右パネルでサイズや色を調整
3. **保存**: 右上の「💾 保存」ボタンでLocalStorageに保存
4. **エクスポート**: PNG/PDF/JSONボタンでファイル出力
5. **共有**: 「共有コード」ボタンでコピー→他の人に送る

## ⚡ トラブルシューティング

### ポート5173が使用中の場合

別のポートを使用する場合は、`vite.config.ts`を編集：

```typescript
server: {
  port: 5174, // 別のポート番号に変更
},
```

### 依存関係のエラー

node_modulesを削除して再インストール：

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### ブラウザでエラーが出る場合

1. ブラウザのキャッシュをクリア
2. Ctrl+Shift+R で強制リロード
3. LocalStorageをクリア（開発者ツール → Application → Local Storage）

## 📚 詳細情報

詳しい機能説明やアーキテクチャについては、[README.md](./README.md)をご覧ください。
