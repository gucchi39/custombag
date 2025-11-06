import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Design } from '@/types/design'
import { Button } from './Button'

interface ARViewerProps {
  design: Design
  onClose: () => void
}

export function ARViewer({ design, onClose }: ARViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isARActive, setIsARActive] = useState(false)
  const [error, setError] = useState<string>('')
  const sessionRef = useRef<XRSession | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  // WebXRサポートチェック
  const checkARSupport = async () => {
    if (!('xr' in navigator)) {
      return false
    }
    
    try {
      const supported = await (navigator as any).xr?.isSessionSupported?.('immersive-ar')
      return !!supported
    } catch {
      return false
    }
  }

  // ARセッション開始
  const startAR = async () => {
    if (!canvasRef.current) return

    try {
      const supported = await checkARSupport()
      if (!supported) {
        setError('お使いのデバイスはARに対応していません。ARCore/ARKit対応のスマートフォンをお使いください。')
        return
      }

      // WebXRセッション開始
      const xr = (navigator as any).xr
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      })

      sessionRef.current = session

      // Three.jsセットアップ
      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      })
      renderer.xr.enabled = true
      renderer.xr.setSession(session)
      rendererRef.current = renderer

      const scene = new THREE.Scene()
      
      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      )

      // ライト追加
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
      scene.add(light)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(0, 1, 1)
      scene.add(directionalLight)

      // バッグの3Dモデル作成
      const bag = createBagMesh(design)
      bag.position.set(0, 0, -1) // カメラから1m前方
      scene.add(bag)

      // アニメーションループ
      const animate = (_time: number, frame?: XRFrame) => {
        if (frame) {
          // バッグを少し回転させる
          bag.rotation.y += 0.01
          renderer.render(scene, camera)
        }
      }

      renderer.setAnimationLoop(animate)
      setIsARActive(true)

      // セッション終了時の処理
      session.addEventListener('end', () => {
        setIsARActive(false)
        renderer.setAnimationLoop(null)
        renderer.dispose()
        sessionRef.current = null
      })

    } catch (err: any) {
      console.error('AR起動エラー:', err)
      setError(`ARの起動に失敗しました: ${err.message}`)
    }
  }

  // バッグの3Dメッシュを作成
  const createBagMesh = (design: Design): THREE.Group => {
    const group = new THREE.Group()
    
    // バッグ本体のサイズ（メートル単位）
    const widthM = design.widthMM / 1000
    const heightM = design.heightMM / 1000
    const depthM = 0.05 // 5cm固定

    // バッグ本体
    const bodyGeometry = new THREE.BoxGeometry(widthM, heightM, depthM)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: design.color || '#8B5CF6',
      roughness: 0.7,
      metalness: 0.1
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    group.add(body)

    // 側面パネル
    const sideGeometry = new THREE.BoxGeometry(depthM, heightM, depthM)
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: design.color || '#8B5CF6',
      roughness: 0.8,
      metalness: 0.1
    })
    
    const leftSide = new THREE.Mesh(sideGeometry, sideMaterial)
    leftSide.position.x = -(widthM / 2 + depthM / 2)
    group.add(leftSide)
    
    const rightSide = new THREE.Mesh(sideGeometry, sideMaterial)
    rightSide.position.x = widthM / 2 + depthM / 2
    group.add(rightSide)

    // 底面
    const bottomGeometry = new THREE.BoxGeometry(widthM, depthM, depthM)
    const bottom = new THREE.Mesh(bottomGeometry, sideMaterial)
    bottom.position.y = -(heightM / 2 + depthM / 2)
    group.add(bottom)

    // ハンドル
    const handleCurve = new THREE.EllipseCurve(
      0, 0,
      widthM * 0.3, heightM * 0.15,
      0, Math.PI,
      false,
      0
    )
    const handlePoints = handleCurve.getPoints(50)
    const handleGeometry = new THREE.BufferGeometry().setFromPoints(
      handlePoints.map(p => new THREE.Vector3(p.x, p.y, 0))
    )
    const handleMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      linewidth: 3
    })
    const handle = new THREE.Line(handleGeometry, handleMaterial)
    handle.position.y = heightM / 2 + 0.02
    handle.position.z = depthM / 2
    group.add(handle)

    // エッジライン（輪郭）
    const edges = new THREE.EdgesGeometry(bodyGeometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
    group.add(edgeLines)

    return group
  }

  // ARセッション終了
  const stopAR = () => {
    if (sessionRef.current) {
      sessionRef.current.end()
    }
  }

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      stopAR()
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* AR描画用キャンバス */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${isARActive ? 'block' : 'hidden'}`}
      />

      {/* UI オーバーレイ */}
      {!isARActive && (
        <div className="relative z-10 max-w-md w-full mx-4 bg-white rounded-2xl p-8 shadow-2xl">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full text-2xl font-bold shadow-lg transition-colors"
            title="閉じる"
          >
            ×
          </button>

          {/* タイトル */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800 pr-12">📱 ARモード</h2>

          {/* バッグ情報 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800">実寸サイズ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-600 mb-1">横幅</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(design.widthMM / 10)} cm
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-600 mb-1">高さ</div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(design.heightMM / 10)} cm
                </div>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800">💡 使い方</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>下の「ARを起動」ボタンをタップ</li>
              <li>カメラへのアクセスを許可</li>
              <li>スマホを動かして平面を検出</li>
              <li>バッグが実寸大で表示されます！</li>
            </ol>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-bold text-red-800 mb-1">エラー</div>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">📱</span>
              <div className="text-sm text-gray-700">
                <div className="font-bold mb-1">対応デバイス</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>iOS 12以降のiPhone（ARKit対応）</li>
                  <li>Android 7.0以降（ARCore対応）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              className="w-full text-lg py-4"
              onClick={startAR}
            >
              🎯 ARを起動
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={onClose}
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}

      {/* AR起動中のUI */}
      {isARActive && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <Button
            variant="secondary"
            className="bg-white bg-opacity-90 backdrop-blur-sm shadow-2xl text-lg py-4 px-8"
            onClick={stopAR}
          >
            ARを終了
          </Button>
        </div>
      )}
    </div>
  )
}
