import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/custombag/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // 強力なキャッシュ無効化設定
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    },
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true, // ファイル変更の検出を改善
      interval: 100, // ポーリング間隔を短く
    },
    // 厳密なOriginチェックを無効化
    strictPort: false,
  },
  // ビルド時のキャッシュ設定
  build: {
    // ファイル名にハッシュを含めてキャッシュ問題を防ぐ
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // 開発時のキャッシュを無効化
  cacheDir: '.vite',
  // 依存関係の事前バンドルを強制的に再実行
  optimizeDeps: {
    force: true,
  },
})
