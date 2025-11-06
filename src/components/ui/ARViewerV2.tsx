import { useEffect, useRef, useState } from 'react'
import { Design } from '@/types/design'
import { Button } from './Button'
import '@google/model-viewer'

interface ARViewerV2Props {
  design: Design
  onClose: () => void
}

// model-viewerの型定義を拡張
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

export function ARViewerV2({ design, onClose }: ARViewerV2Props) {
  const modelViewerRef = useRef<any>(null)
  const [modelUrl, setModelUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // デバイス判定
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  const isMobile = isIOS || isAndroid

  useEffect(() => {
    // バッグの3Dモデルを生成（GLB形式）
    generateBagModel()
  }, [design])

  const generateBagModel = async () => {
    try {
      setIsLoading(true)
      
      // Three.jsで3Dモデルを作成してGLBにエクスポート
      const THREE = await import('three')
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
      
      const scene = new THREE.Scene()
      
      // バッグのサイズ（メートル単位）
      const widthM = design.widthMM / 1000
      const heightM = design.heightMM / 1000
      const depthM = 0.05

      // マテリアル
      const material = new THREE.MeshStandardMaterial({
        color: design.color || '#8B5CF6',
        roughness: 0.7,
        metalness: 0.1,
      })

      // バッグ本体
      const bodyGeometry = new THREE.BoxGeometry(widthM, heightM, depthM)
      const body = new THREE.Mesh(bodyGeometry, material)
      scene.add(body)

      // 側面
      const sideGeometry = new THREE.BoxGeometry(depthM, heightM, depthM)
      const leftSide = new THREE.Mesh(sideGeometry, material)
      leftSide.position.x = -(widthM / 2 + depthM / 2)
      scene.add(leftSide)
      
      const rightSide = new THREE.Mesh(sideGeometry, material)
      rightSide.position.x = widthM / 2 + depthM / 2
      scene.add(rightSide)

      // 底面
      const bottomGeometry = new THREE.BoxGeometry(widthM, depthM, depthM)
      const bottom = new THREE.Mesh(bottomGeometry, material)
      bottom.position.y = -(heightM / 2 + depthM / 2)
      scene.add(bottom)

      // ライト追加
      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1)
      scene.add(light)

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      // GLBにエクスポート
      const exporter = new GLTFExporter()
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' })
          const url = URL.createObjectURL(blob)
          setModelUrl(url)
          setIsLoading(false)
        },
        (error) => {
          console.error('GLBエクスポートエラー:', error)
          setError('3Dモデルの生成に失敗しました')
          setIsLoading(false)
        },
        { binary: true }
      )
    } catch (err) {
      console.error('モデル生成エラー:', err)
      setError('3Dモデルの生成に失敗しました')
      setIsLoading(false)
    }
  }

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl)
      }
    }
  }, [modelUrl])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full h-full max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-2xl font-bold transition-colors"
            title="閉じる"
          >
            ×
          </button>
          <h2 className="text-3xl font-bold mb-2 pr-12">📱 ARで確認</h2>
          <p className="text-white text-opacity-90">実寸大でバッグを表示</p>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* サイズ表示 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">実寸サイズ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">横幅</div>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(design.widthMM / 10)} cm
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">高さ</div>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(design.heightMM / 10)} cm
                </div>
              </div>
            </div>
          </div>

          {/* 3Dプレビュー */}
          {!isLoading && !error && modelUrl && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">3Dプレビュー</h3>
              <model-viewer
                ref={modelViewerRef}
                src={modelUrl}
                alt="カスタムバッグの3Dモデル"
                ar
                ar-modes={isIOS ? "quick-look" : "scene-viewer webxr"}
                camera-controls
                touch-action="pan-y"
                auto-rotate
                shadow-intensity="1"
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.75rem'
                }}
              >
                {isMobile && (
                  <button
                    slot="ar-button"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-purple-700 transition-colors"
                  >
                    🎯 ARで見る
                  </button>
                )}
              </model-viewer>
            </div>
          )}

          {/* ローディング */}
          {isLoading && (
            <div className="bg-gray-50 rounded-xl p-12 mb-6 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-600 font-medium">3Dモデルを生成中...</p>
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <div className="font-bold text-red-800 mb-2">エラー</div>
                  <div className="text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* 使い方 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
              💡 使い方
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-white rounded-lg p-4 shadow-sm">
              {isIOS && (
                <>
                  <li>3Dプレビューの「ARで見る」ボタンをタップ</li>
                  <li>Quick Lookが起動します</li>
                  <li>平面を検出して、バッグを配置</li>
                  <li>実寸大で確認できます！</li>
                </>
              )}
              {isAndroid && (
                <>
                  <li>3Dプレビューの「ARで見る」ボタンをタップ</li>
                  <li>Google Scene Viewerが起動します</li>
                  <li>カメラで平面を検出</li>
                  <li>実寸大で確認できます！</li>
                </>
              )}
              {!isMobile && (
                <>
                  <li>スマートフォンでQRコードをスキャン</li>
                  <li>モバイルで3Dプレビューを表示</li>
                  <li>「ARで見る」ボタンでAR起動</li>
                  <li>実寸大で確認できます！</li>
                </>
              )}
            </ol>
          </div>

          {/* デバイス情報 */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{isMobile ? '✅' : '📱'}</span>
              <div className="text-sm">
                <div className="font-bold text-gray-800 mb-1">
                  {isMobile ? 'AR対応デバイス' : 'スマホでご利用ください'}
                </div>
                <div className="text-gray-700">
                  {isIOS && 'iOS Quick Look対応'}
                  {isAndroid && 'Android ARCore対応'}
                  {!isMobile && 'スマートフォンでアクセスするとAR機能が使えます'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="border-t p-4 bg-gray-50">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            閉じる
          </Button>
        </div>
      </div>
    </div>
  )
}
