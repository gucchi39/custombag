import { useState } from 'react'
import { Design } from '@/types/design'
import { Button } from './Button'

interface ARPreviewProps {
  design: Design
  onClose: () => void
}

export function ARPreview({ design, onClose }: ARPreviewProps) {
  const [isARSupported] = useState(() => {
    // WebXR APIのサポートチェック
    return 'xr' in navigator
  })

  const widthCM = Math.round(design.widthMM / 10)
  const heightCM = Math.round(design.heightMM / 10)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* タイトル */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📱 ARで確認</h2>

        {/* バッグ情報 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">バッグの実寸サイズ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">横幅</div>
              <div className="text-3xl font-bold text-blue-600">{widthCM} cm</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">高さ</div>
              <div className="text-3xl font-bold text-purple-600">{heightCM} cm</div>
            </div>
          </div>
        </div>

        {/* 説明 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">💡 使い方</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <strong>スマートフォン</strong>で以下のQRコードをスキャン
            </li>
            <li>
              ARモードで実際のサイズを<strong>実物で確認</strong>できます
            </li>
            <li>
              ぬいぐるみやバッジが入るかチェック！
            </li>
          </ol>
        </div>

        {/* QRコードプレースホルダー */}
        <div className="bg-gray-100 rounded-xl p-8 mb-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center mb-4 border-4 border-gray-300">
            <div className="text-center">
              <div className="text-6xl mb-2">📱</div>
              <div className="text-sm text-gray-600">QRコード</div>
              <div className="text-xs text-gray-500 mt-1">スマホでスキャン</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            ※ AR機能は現在準備中です
          </p>
        </div>

        {/* AR対応状況 */}
        <div className={`rounded-lg p-4 mb-6 ${isARSupported ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isARSupported ? '✅' : '⚠️'}</span>
            <div>
              <div className="font-bold text-gray-800">
                {isARSupported ? 'お使いのデバイスはAR対応です' : 'AR機能について'}
              </div>
              <div className="text-sm text-gray-600">
                {isARSupported
                  ? 'スマートフォンでQRコードをスキャンすると、実際のサイズでバッグを確認できます'
                  : 'スマートフォンのカメラでQRコードをスキャンしてAR表示をお試しください'}
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            閉じる
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              // 将来的にはQRコードをダウンロード
              alert('QRコードのダウンロード機能は準備中です')
            }}
          >
            📥 QRコードを保存
          </Button>
        </div>
      </div>
    </div>
  )
}
