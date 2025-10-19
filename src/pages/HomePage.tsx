import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEED_DESIGNS } from '@/data/seeds'
import { useDesignStore } from '@/state/designStore'
import { BAG_TYPES } from '@/config/pricing'

export function HomePage() {
  const navigate = useNavigate()
  const setDesign = useDesignStore(state => state.setDesign)

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
    setDesign(newDesign)
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
          {SEED_DESIGNS.map(seed => (
            <Card
              key={seed.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePreset(seed.id)}
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-6xl">
                  {seed.id.includes('anime') && '🎭'}
                  {seed.id.includes('kpop') && '🎤'}
                  {seed.id.includes('2.5') && '⚔️'}
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
        <Button size="lg" onClick={handleNewDesign}>
          今すぐカスタムを始める
        </Button>
      </section>
    </div>
  )
}
