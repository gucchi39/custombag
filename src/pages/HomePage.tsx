import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEED_DESIGNS } from '@/data/seeds'
import { useDesignStore } from '@/state/designStore'
import { BAG_TYPES } from '@/config/pricing'

export function HomePage() {
  const navigate = useNavigate()
  const setDesign = useDesignStore(state => state.setDesign)

  // 開発用：Seedデータをリセット
  const handleResetSeeds = () => {
    if (confirm('ギャラリーに10個のサンプル投稿を追加しますか？\n（既存のデザインは削除され、サンプルデータに置き換わります）')) {
      localStorage.removeItem('oshi_bag_designs')
      alert('サンプルデータを読み込みました！\nギャラリーページで確認してください 🎉')
      window.location.href = '/gallery'
    }
  }

  const handleNewDesign = () => {
    const newDesign = {
      id: `design-${Date.now()}`,
      title: '新しいデザイン',
      bagType: 'tote' as const,
      color: '#FFFFFF',
      widthMM: BAG_TYPES[0].defaultWidth,
      heightMM: BAG_TYPES[0].defaultHeight,
      seamMM: 10,
      elements: [],
      priceJPY: 3500,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    console.log('Creating new design:', newDesign)
    setDesign(newDesign)
    console.log('Navigating to /design')
    navigate('/design')
  }

  const handlePreset = (seedId: string) => {
    const seed = SEED_DESIGNS.find(s => s.id === seedId)
    if (seed) {
      const newDesign = {
        ...seed,
        id: `design-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setDesign(newDesign)
      navigate('/design')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          推しが主役のバッグ、
          <br />
          あなた仕様で。
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">見せる×入るを、自由設計。</p>
        <Button size="lg" onClick={handleNewDesign}>
          カスタムをはじめる
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">📐</div>
            <h3 className="text-lg font-bold mb-2">mm単位で正確配置</h3>
            <p className="text-gray-600 text-sm">
              クリア窓・ポケット・バッジパネルをmm単位で自由に配置できます
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-bold mb-2">フィットチェック</h3>
            <p className="text-gray-600 text-sm">
              持ち物の影を置いて、入る/入らないを視覚的に確認
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-bold mb-2">リアルタイム見積</h3>
            <p className="text-gray-600 text-sm">
              デザインを編集すると自動で概算価格を表示
            </p>
          </Card>
        </div>
      </section>

      {/* Presets */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">テンプレートから始める</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {SEED_DESIGNS.slice(0, 3).map(seed => (
            <Card
              key={seed.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePreset(seed.id)}
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* バッグのシルエット */}
                  <div className="relative">
                    {seed.bagType === 'tote' ? (
                      // トートバッグ
                      <div className="relative">
                        <div className="w-32 h-36 bg-gradient-to-br from-gray-300 to-gray-400 rounded-b-lg shadow-lg relative">
                          {/* ハンドル */}
                          <div className="absolute -top-4 left-4 w-8 h-6 border-4 border-gray-400 rounded-t-full"></div>
                          <div className="absolute -top-4 right-4 w-8 h-6 border-4 border-gray-400 rounded-t-full"></div>
                          {/* 窓 */}
                          {seed.elements.some(e => e.type === 'window') && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-200 bg-opacity-40 rounded-lg border-2 border-blue-300"></div>
                          )}
                          {/* ポケット */}
                          {seed.elements.some(e => e.type === 'pocket') && (
                            <div className="absolute bottom-2 right-2 w-8 h-12 bg-gray-500 rounded-sm opacity-50"></div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // ショルダーバッグ
                      <div className="relative">
                        <div className="w-28 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-lg relative">
                          {/* ストラップ */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-10 bg-gray-400"></div>
                          {/* 窓 */}
                          {seed.elements.some(e => e.type === 'window') && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-blue-200 bg-opacity-40 rounded-full border-2 border-blue-300"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* アイコン */}
                  <div className="absolute bottom-2 right-2 text-4xl">
                    {seed.id.includes('anime') && '🎭'}
                    {seed.id.includes('kpop') && '🎤'}
                    {seed.id.includes('2.5') && '⚔️'}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{seed.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {seed.bagType === 'tote' ? 'トートバッグ' : 'ショルダーバッグ'} ·{' '}
                  {seed.elements.length}要素
                </p>
                <p className="text-primary-600 font-bold">¥{seed.priceJPY.toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-6">
          mm単位で正確に配置できます。縫い代ガイドにご注意ください。
        </p>
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Button size="lg" onClick={handleNewDesign}>
            今すぐカスタムを始める
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleResetSeeds}
            className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-2 border-purple-300"
          >
            🎉 サンプル投稿10個を見る
          </Button>
        </div>
      </section>
    </div>
  )
}
