import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BagPostCard } from '@/components/ui/BagPostCard'
import { useGalleryStore } from '@/state/galleryStore'
import { useDesignStore } from '@/state/designStore'
import { useToastStore } from '@/state/toastStore'
import { decodeShareCode, encodeShareCode } from '@/utils/export/shareCode'

type FilterType = 'all' | 'public' | 'private'
type SortType = 'recent' | 'popular' | 'likes'

export function GalleryPage() {
  const navigate = useNavigate()
  const { designs, loadDesigns, deleteDesign, updateDesign } = useGalleryStore()
  const setDesign = useDesignStore(state => state.setDesign)
  const showToast = useToastStore(state => state.show)
  const [shareCodeInput, setShareCodeInput] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('recent')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    loadDesigns()
  }, [loadDesigns])

  // タグ一覧を取得
  const allTags = Array.from(
    new Set(designs.flatMap(d => d.tags || []))
  ).sort()

  // フィルタリング＆ソート
  const filteredDesigns = designs
    .filter(d => {
      if (filter === 'public') return d.isPublic === true
      if (filter === 'private') return !d.isPublic
      return true
    })
    .filter(d => {
      if (selectedTag) return d.tags?.includes(selectedTag)
      return true
    })
    .sort((a, b) => {
      if (sort === 'recent') return b.createdAt - a.createdAt
      if (sort === 'popular') return (b.views || 0) - (a.views || 0)
      if (sort === 'likes') return (b.likes || 0) - (a.likes || 0)
      return 0
    })

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

  const handleLike = (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      updateDesign(designId, {
        likes: (design.likes || 0) + 1,
      })
    }
  }

  const handleComment = (designId: string, commentText: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      const newComment = {
        id: `comment-${Date.now()}`,
        authorName: 'あなた',
        text: commentText,
        createdAt: Date.now(),
      }
      updateDesign(designId, {
        comments: [...(design.comments || []), newComment],
      })
      showToast('コメントを投稿しました', 'success')
    }
  }

  const handlePublish = (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      const isPublic = !design.isPublic
      updateDesign(designId, { isPublic })
      showToast(
        isPublic ? '公開しました🎉' : '非公開にしました',
        'success'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎒 推しバッグギャラリー
          </h1>
          <p className="text-gray-600">あなたの推しバッグをみんなとシェアしよう！</p>
        </div>

        {/* フィルターバー */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* タブフィルター */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === 'public'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌐 公開中
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === 'private'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔒 非公開
            </button>
          </div>

          {/* ソート */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm text-gray-600 font-medium">並び順:</span>
            <button
              onClick={() => setSort('recent')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                sort === 'recent'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📅 新着順
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                sort === 'popular'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🔥 人気順
            </button>
            <button
              onClick={() => setSort('likes')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                sort === 'likes'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              💖 いいね順
            </button>
          </div>

          {/* タグフィルター */}
          {allTags.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-sm text-gray-600 font-medium">タグ:</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    !selectedTag
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  すべて
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* デザインリスト */}
        {filteredDesigns.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎒</div>
            <p className="text-gray-500 mb-4 text-lg">
              {filter !== 'all' || selectedTag
                ? 'デザインが見つかりませんでした'
                : 'まだ公開投稿がありません'}
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              サンプル投稿を見てみませんか？
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={() => {
                  if (confirm('10個のサンプル投稿を読み込みますか？\n（既存のデザインは削除されます）')) {
                    localStorage.removeItem('oshi_bag_designs')
                    window.location.reload()
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                🎉 サンプル投稿を見る
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
              >
                新しいデザインを作成
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredDesigns.map(design => (
              <div key={design.id} className="relative">
                <BagPostCard
                  design={design}
                  onLike={handleLike}
                  onComment={handleComment}
                  onOpenDesign={handleOpenDesign}
                  onDelete={handleDelete}
                  onShare={handleCopyShareCode}
                />
                {/* 公開/非公開ボタン */}
                <button
                  onClick={() => handlePublish(design.id)}
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full font-medium text-sm shadow-lg transition-all ${
                    design.isPublic
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                  title={design.isPublic ? '公開中' : '非公開'}
                >
                  {design.isPublic ? '🌐 公開中' : '� 非公開'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 共有コードインポート */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📤</span>
            <span>共有コードを読み込む</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="共有コードを貼り付け..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={shareCodeInput}
              onChange={e => setShareCodeInput(e.target.value)}
            />
            <Button
              onClick={handleImportShareCode}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              読み込み
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
