import { useEffect } from 'react'
import { useToastStore } from '@/state/toastStore'
import clsx from 'clsx'

export function Toast() {
  const { message, type, visible, hide } = useToastStore()

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hide()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, hide])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={clsx(
          'px-6 py-3 rounded-lg shadow-lg text-white font-medium min-w-[200px]',
          {
            'bg-green-600': type === 'success',
            'bg-red-600': type === 'error',
            'bg-blue-600': type === 'info',
          }
        )}
      >
        {message}
      </div>
    </div>
  )
}
