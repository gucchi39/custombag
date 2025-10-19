import { useState } from 'react'
import { Design } from '@/types/design'
import { Button } from './Button'

interface BagPostCardProps {
  design: Design
  onLike: (designId: string) => void
  onComment: (designId: string, comment: string) => void
  onOpenDesign: (designId: string) => void
  onDelete?: (designId: string) => void
  onShare?: (designId: string) => void
}

export function BagPostCard({ design, onLike, onComment, onOpenDesign, onDelete, onShare }: BagPostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(design.id)
  }

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(design.id, commentText)
      setCommentText('')
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    if (days < 7) return `${days}日前`
    return date.toLocaleDateString('ja-JP')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* ヘッダー */}
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
          {design.authorName?.[0] || '👤'}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-800">{design.authorName || '匿名ユーザー'}</div>
          <div className="text-sm text-gray-500">{formatDate(design.createdAt)}</div>
        </div>
        
        {/* メニューボタン */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl">⋮</span>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border z-10 py-2 min-w-[150px]">
              {onShare && (
                <button
                  onClick={() => {
                    onShare(design.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>📤</span>
                  <span>シェア</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('このデザインを削除しますか？')) {
                      onDelete(design.id)
                      setShowMenu(false)
                    }
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <span>🗑️</span>
                  <span>削除</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* バッグプレビュー */}
      <div 
        className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity p-8"
        onClick={() => onOpenDesign(design.id)}
        style={{ backgroundColor: design.color === '#FFFFFF' ? '#F3F4F6' : `${design.color}20` }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* バッグイラスト */}
          {design.bagType === 'tote' ? (
            // トートバッグ
            <div className="relative">
              <div 
                className="w-40 h-44 rounded-b-xl shadow-2xl relative border-4 border-opacity-20"
                style={{ 
                  backgroundColor: design.color,
                  borderColor: design.color === '#FFFFFF' ? '#D1D5DB' : '#00000030'
                }}
              >
                {/* ハンドル */}
                <div 
                  className="absolute -top-5 left-6 w-10 h-7 border-4 rounded-t-full"
                  style={{ borderColor: design.color === '#FFFFFF' ? '#9CA3AF' : design.color }}
                ></div>
                <div 
                  className="absolute -top-5 right-6 w-10 h-7 border-4 rounded-t-full"
                  style={{ borderColor: design.color === '#FFFFFF' ? '#9CA3AF' : design.color }}
                ></div>
                
                {/* 窓 */}
                {design.elements.some(e => e.type === 'window') && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-100 bg-opacity-60 rounded-xl border-3 border-blue-200 shadow-inner"></div>
                )}
                
                {/* 缶バッジパネル */}
                {design.elements.some(e => e.type === 'badge_panel') && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-pink-300 border-2 border-white shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-white shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-white shadow-sm"></div>
                  </div>
                )}
                
                {/* ポケット */}
                {design.elements.some(e => e.type === 'pocket') && (
                  <div className="absolute bottom-3 right-3 w-10 h-14 bg-black bg-opacity-20 rounded-sm border border-black border-opacity-30"></div>
                )}
              </div>
            </div>
          ) : (
            // ショルダーバッグ
            <div className="relative">
              <div 
                className="w-32 h-28 rounded-xl shadow-2xl relative border-4 border-opacity-20"
                style={{ 
                  backgroundColor: design.color,
                  borderColor: design.color === '#FFFFFF' ? '#D1D5DB' : '#00000030'
                }}
              >
                {/* ストラップ */}
                <div 
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-1.5 h-14 rounded-full"
                  style={{ backgroundColor: design.color === '#FFFFFF' ? '#9CA3AF' : design.color }}
                ></div>
                
                {/* 窓 */}
                {design.elements.some(e => e.type === 'window') && (
                  design.elements.find(e => e.type === 'window')?.props?.shape === 'circle' ? (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-100 bg-opacity-60 rounded-full border-3 border-blue-200 shadow-inner"></div>
                  ) : (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-14 bg-blue-100 bg-opacity-60 rounded-lg border-3 border-blue-200 shadow-inner"></div>
                  )
                )}
                
                {/* ポケット */}
                {design.elements.some(e => e.type === 'pocket') && (
                  <div className="absolute bottom-2 right-2 w-8 h-10 bg-black bg-opacity-20 rounded-sm border border-black border-opacity-30"></div>
                )}
              </div>
            </div>
          )}
          
          {/* サイズ表示 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {design.widthMM / 10} × {design.heightMM / 10} cm
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{design.title}</h3>
        {design.description && (
          <p className="text-gray-700 mb-3">{design.description}</p>
        )}
        
        {/* タグ */}
        {design.tags && design.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {design.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 詳細情報 */}
        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span>
            {design.bagType === 'tote' ? '🎒 トート' : '👝 ショルダー'}
          </span>
          <span>💎 {design.elements.length}要素</span>
          <span>💰 ¥{design.priceJPY.toLocaleString()}</span>
        </div>

        {/* アクションボタン */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 font-medium transition-all ${
              isLiked 
                ? 'text-pink-500 hover:text-pink-600' 
                : 'text-gray-600 hover:text-pink-500'
            }`}
          >
            <span className="text-2xl">{isLiked ? '💖' : '🤍'}</span>
            <span>{design.likes || 0}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 font-medium transition-colors"
          >
            <span className="text-2xl">💬</span>
            <span>{design.comments?.length || 0}</span>
          </button>
          
          <button
            onClick={() => onOpenDesign(design.id)}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-500 font-medium transition-colors ml-auto"
          >
            <span>編集する</span>
            <span className="text-xl">✏️</span>
          </button>
        </div>

        {/* コメントセクション */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            {/* コメント一覧 */}
            {design.comments && design.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {design.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {comment.authorName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="font-medium text-sm text-gray-800 mb-1">
                          {comment.authorName}
                        </div>
                        <div className="text-gray-700">{comment.text}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 px-3">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* コメント入力 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="コメントを追加..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSubmitComment()}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="rounded-full"
              >
                送信
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
