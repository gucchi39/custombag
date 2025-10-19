import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            OSHI BAG BUILDER
          </Link>

          <div className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ホーム
            </Link>
            <Link
              to="/design"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/design'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              エディタ
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/gallery'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ギャラリー
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
