import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGalleryStore } from '@/state/galleryStore'
import { useDesignStore } from '@/state/designStore'
import { useToastStore } from '@/state/toastStore'
import { decodeShareCode, encodeShareCode } from '@/utils/export/shareCode'

export function GalleryPage() {
  const navigate = useNavigate()
  const { designs, loadDesigns, deleteDesign } = useGalleryStore()
  const setDesign = useDesignStore(state => state.setDesign)
  const showToast = useToastStore(state => state.show)
  const [shareCodeInput, setShareCodeInput] = useState('')

  useEffect(() => {
    loadDesigns()
  }, [loadDesigns])

  const handleOpenDesign = (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      setDesign(design)
      navigate('/design')
    }
  }

  const handleDelete = (designId: string) => {
    if (confirm('このデザインを削除しますか?')) {
      deleteDesign(designId)
      showToast('デザインを削除しました', 'success')
    }
  }

  const handleImportShareCode = () => {
    if (!shareCodeInput.trim()) {
      showToast('共有コードを入力してください', 'error')
      return
    }

    const design = decodeShareCode(shareCodeInput.trim())
    if (design) {
      setDesign(design)
      showToast('デザインを読み込みました', 'success')
      navigate('/design')
    } else {
      showToast('無効な共有コードです', 'error')
    }
  }

  const handleCopyShareCode = (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      const code = encodeShareCode(design)
      navigator.clipboard.writeText(code)
      showToast('共有コードをコピーしました', 'success')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">ギャラリー</h1>
          <p className="text-gray-600">保存されたデザイン一覧</p>
        </div>

        {/* 共有コードインポート */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">共有コードを読み込む</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="共有コードを貼り付け..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={shareCodeInput}
              onChange={e => setShareCodeInput(e.target.value)}
            />
            <Button onClick={handleImportShareCode}>読み込み</Button>
          </div>
        </Card>

        {/* デザインリスト */}
        {designs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">まだデザインがありません</p>
            <Button onClick={() => navigate('/')}>新しいデザインを作成</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map(design => (
              <Card key={design.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎒</div>
                    <p className="text-sm text-gray-600">
                      {design.widthMM} × {design.heightMM} mm
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{design.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {design.bagType === 'tote' ? 'トートバッグ' : 'ショルダーバッグ'} ·{' '}
                    {design.elements.length}要素
                  </p>
                  <p className="text-primary-600 font-bold mb-4">
                    ¥{design.priceJPY.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleOpenDesign(design.id)}
                    >
                      開く
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyShareCode(design.id)}
                      title="共有コードをコピー"
                    >
                      📤
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(design.id)}
                      title="削除"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
