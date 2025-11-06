import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Design } from '@/types/design'
import { Button } from './Button'
import { ARViewer } from './ARViewer'
import { encodeShareCode } from '@/utils/export/shareCode'

interface ARPreviewProps {
  design: Design
  onClose: () => void
}

export function ARPreview({ design, onClose }: ARPreviewProps) {
  const [showARViewer, setShowARViewer] = useState(false)
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [isARSupported] = useState(() => {
    // WebXR APIのサポートチェック
    return 'xr' in navigator
  })

  // QRコード生成
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // デザインをエンコードしてURLを生成
        const shareCode = encodeShareCode(design)
        // GitHub Pagesの正しいベースURLを使用
        const baseURL = window.location.origin + '/custombag/'
        const arURL = `${baseURL}#ar=${shareCode}`
        
        // QRコード生成
        const dataURL = await QRCode.toDataURL(arURL, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeDataURL(dataURL)
      } catch (err) {
        console.error('QRコード生成エラー:', err)
      }
    }

    generateQRCode()
  }, [design])

  // ARビューアーを表示
  if (showARViewer) {
    return <ARViewer design={design} onClose={() => setShowARViewer(false)} />
  }

  const widthCM = Math.round(design.widthMM / 10)
  const heightCM = Math.round(design.heightMM / 10)

  // QRコードをダウンロード
  const downloadQRCode = () => {
    if (!qrCodeDataURL) return
    
    const link = document.createElement('a')
    link.download = `bag-ar-qrcode-${Date.now()}.png`
    link.href = qrCodeDataURL
    link.click()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full text-2xl font-bold shadow-lg transition-colors z-10"
          title="閉じる"
        >
          ×
        </button>

        {/* タイトル */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pr-12">📱 ARで確認</h2>

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

        {/* QRコード表示 */}
        <div className="bg-gray-100 rounded-xl p-8 mb-6 flex flex-col items-center">
          {qrCodeDataURL ? (
            <>
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <img 
                  src={qrCodeDataURL} 
                  alt="AR QRコード" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-700 text-center font-medium mb-2">
                📱 スマホでスキャンしてAR表示
              </p>
              <p className="text-xs text-gray-500 text-center">
                カメラアプリでQRコードを読み取ってください
              </p>
            </>
          ) : (
            <div className="w-48 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-sm text-gray-600">QRコード生成中...</div>
              </div>
            </div>
          )}
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
        <div className="flex flex-col gap-3">
          {/* PCの場合：QRコードをダウンロード、スマホの場合：直接AR起動 */}
          <Button
            variant="primary"
            className="w-full text-lg py-3"
            onClick={() => {
              // スマホの場合は直接AR起動
              if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
                setShowARViewer(true)
              } else {
                // PCの場合はQRコードダウンロード
                downloadQRCode()
              }
            }}
            disabled={!qrCodeDataURL}
          >
            {/iPhone|iPad|Android/i.test(navigator.userAgent) 
              ? '🎯 ARを起動' 
              : '📥 QRコードを保存'}
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              ← 戻る
            </Button>
            {!/iPhone|iPad|Android/i.test(navigator.userAgent) && (
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowARViewer(true)}
              >
                🧪 テスト起動
              </Button>
            )}
          </div>
        </div>
        
        {/* モバイル用の閉じるヒント */}
        <p className="text-center text-sm text-gray-500 mt-4">
          💡 画面の外をタップして閉じる
        </p>
      </div>
    </div>
  )
}
