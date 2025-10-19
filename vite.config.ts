import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // キャッシュを無効化して常に最新の状態を反映
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true, // ファイル変更の検出を改善
    },
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
})
