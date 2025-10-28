import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Toast } from './components/ui/Toast'
import { HomePage } from './pages/HomePage'
import { DesignPage } from './pages/DesignPage'
import { GalleryPage } from './pages/GalleryPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/custombag">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </main>
        <Toast />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
