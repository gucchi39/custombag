# OSHI BAG BUILDER - 開発指示書

このファイルは、GitHub Copilotとの会話を通じてこのプロジェクトを開発・修正する際の指示書です。

## 🚨 最重要ルール 🚨

### **コード変更後は必ずGitコミット＆プッシュを自動実行**
- ユーザーがコード変更を依頼したら、変更完了後に**自動的に**以下を実行：
  1. `git add -A`
  2. `git commit -m "適切なコミットメッセージ"`
  3. `git push origin main`
- **ユーザーが「プッシュして」と言わなくても、自動的に実行する**
- コミットメッセージは変更内容を簡潔に記述（日本語OK）
- デプロイが必要な変更の場合は、プッシュ前に`npm run deploy`も実行

### **コミット＆プッシュ完了の報告**
- コミット＆プッシュが完了したら、必ず以下のように報告する：
  ```
  ✅ **Gitコミット＆プッシュ完了！**
  - コミットメッセージ: "..."
  - コミットハッシュ: ...
  ```
- デプロイも実行した場合は、それも明記する

### 自動コミット＆プッシュの例外
以下の場合は、プッシュ前にユーザーに確認する：
- ユーザーが「まだプッシュしないで」と明示した場合
- 複数の大きな変更を並行して行っている途中
- エラーが発生してビルドが失敗している場合

### コード変更時の必須作業
- 変更内容を明確に記述したコミットメッセージを使用する
- TypeScriptエラーがないか確認してからプッシュ
- 必要に応じてビルド＆デプロイも実行

### プロジェクト構成の理解
- React 18 + TypeScript + Vite
- 状態管理: Zustand (designStore, galleryStore, toastStore)
- ルーティング: React Router v6
- スタイリング: Tailwind CSS
- キャンバス: React-Konva
- デプロイ: GitHub Pages (`https://gucchi39.github.io/custombag/`)

### 開発時の注意点

#### TypeScript
- React 17+では、JSXファイルで`import React from 'react'`は不要
- 必要な関数のみをインポート: `import { useState, useEffect } from 'react'`
- 型エラーが出たら適切な型ガードまたは型アサーションを使用

#### GitHub Pages デプロイ
- `vite.config.ts`の`base: '/custombag/'`は変更しない
- `src/main.tsx`の`<BrowserRouter basename="/custombag">`は変更しない
- デプロイコマンド: `npm run deploy`（自動的にbuild→gh-pages）

#### ルーティング
- パス指定は相対パスで: `/` `/design` `/gallery`
- basename設定のおかげで、GitHub Pages上でも正常に動作

#### 状態管理
- バッグデザイン: `useDesignStore`
- ギャラリー投稿: `useGalleryStore`
- トースト通知: `useToastStore`

### よくある作業パターン

#### 新機能追加時
1. 必要なコンポーネント/ファイルを作成
2. 型定義を`src/types/`に追加（必要に応じて）
3. ローカルでテスト: `npm run dev`
4. TypeScriptエラーがないか確認: `npm run build`
5. Git add, commit, push

#### UI修正時
1. Tailwind CSSクラスを使用してスタイリング
2. レスポンシブデザインを考慮（`sm:` `md:` `lg:`プレフィックス）
3. ダークモード対応は現在未実装
4. Git add, commit, push

#### デプロイ時
1. `npm run build`でエラーがないか確認
2. `npm run deploy`でGitHub Pagesにデプロイ
3. ソースコードもGitにcommit & push
4. ブラウザキャッシュクリアして動作確認

### 禁止事項
- ❌ `vite.config.ts`の`base`を変更しない
- ❌ `BrowserRouter`の`basename`を削除しない
- ❌ プッシュせずに会話を終了しない
- ❌ TypeScriptエラーを無視してデプロイしない

### チェックリスト（会話終了前）
- [ ] TypeScriptエラーが0件
- [ ] `npm run build`が成功
- [ ] 必要に応じて`npm run deploy`実行
- [ ] **Git add, commit, pushを実行**
- [ ] コミットメッセージは内容を反映

## プロジェクト概要

推し活用のカスタムバッグビルダー。ユーザーはバッグの色、窓、ポケット、缶バッジなどを自由にカスタマイズし、AR表示や価格計算、SNS共有機能を利用できます。

### 主要機能
1. **ホームページ**: アプリ紹介、テンプレート表示
2. **エディター**: バッグカスタマイズ、リアルタイムプレビュー、価格表示
3. **ギャラリー**: 投稿一覧、いいね、コメント、タグフィルター
4. **AR表示**: 実寸大プレビュー
5. **エクスポート**: PNG、PDF、共有コード

詳細は`docs/wbs.txt`を参照。

---

**重要**: このファイルの内容に従って開発を進め、会話終了時には必ずGitコミット＆プッシュすること！
