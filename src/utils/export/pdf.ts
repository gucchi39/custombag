import jsPDF from 'jspdf'
import { Design } from '@/types/design'
import { generateBOM } from '@/modules/price/calculator'
import { PRICING_RATES } from '@/config/pricing'

/**
 * デザインをPDFとしてエクスポート
 */
export async function exportPDF(design: Design, canvasDataURL?: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210 // A4幅
  const pageHeight = 297 // A4高さ
  const margin = 20

  // ページ1: 表紙
  pdf.setFontSize(24)
  pdf.text('OSHI BAG BUILDER', margin, margin + 10)

  pdf.setFontSize(16)
  pdf.text(design.title || '無題のデザイン', margin, margin + 25)

  pdf.setFontSize(12)
  pdf.text(`バッグタイプ: ${design.bagType === 'tote' ? 'トートバッグ' : 'ショルダーバッグ'}`, margin, margin + 40)
  pdf.text(`サイズ: ${design.widthMM}mm × ${design.heightMM}mm`, margin, margin + 50)
  pdf.text(`要素数: ${design.elements.length}個`, margin, margin + 60)
  pdf.text(`作成日: ${new Date(design.createdAt).toLocaleDateString('ja-JP')}`, margin, margin + 70)

  // プレビュー画像があれば表示
  if (canvasDataURL) {
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (imgWidth * design.heightMM) / design.widthMM
    const maxHeight = 150

    const finalHeight = Math.min(imgHeight, maxHeight)
    const finalWidth = (finalHeight * design.widthMM) / design.heightMM

    try {
      pdf.addImage(canvasDataURL, 'PNG', margin, margin + 85, finalWidth, finalHeight)
    } catch (error) {
      console.error('Failed to add image to PDF:', error)
    }
  }

  // ページ2: 寸法図
  pdf.addPage()
  pdf.setFontSize(18)
  pdf.text('寸法図', margin, margin + 10)

  pdf.setFontSize(11)
  let yPos = margin + 25

  pdf.text(`バッグ本体: ${design.widthMM}mm × ${design.heightMM}mm`, margin, yPos)
  yPos += 10
  pdf.text(`縫い代: ${design.seamMM}mm`, margin, yPos)
  yPos += 15

  pdf.setFontSize(12)
  pdf.text('要素一覧:', margin, yPos)
  yPos += 10

  pdf.setFontSize(10)
  design.elements.forEach((element, index) => {
    if (element.type === 'shadow_item') return

    const typeName =
      element.type === 'window'
        ? 'クリア窓'
        : element.type === 'pocket'
        ? 'ポケット'
        : element.type === 'badge_panel'
        ? 'バッジパネル'
        : element.type === 'hardware'
        ? '金具'
        : element.type

    let sizeStr = ''
    if (element.rMM) {
      sizeStr = `直径 ${element.rMM * 2}mm`
    } else if (element.wMM && element.hMM) {
      sizeStr = `${element.wMM}mm × ${element.hMM}mm`
    }

    pdf.text(
      `${index + 1}. ${typeName} - 位置: (${element.xMM}, ${element.yMM}) ${sizeStr}`,
      margin + 5,
      yPos
    )
    yPos += 7

    if (yPos > pageHeight - margin) {
      pdf.addPage()
      yPos = margin + 10
    }
  })

  // ページ3: BOM（部品表）
  pdf.addPage()
  pdf.setFontSize(18)
  pdf.text('材料表（BOM）', margin, margin + 10)

  const bom = generateBOM(design, PRICING_RATES)
  yPos = margin + 25

  pdf.setFontSize(11)
  bom.forEach(item => {
    pdf.text(`${item.type} × ${item.count}個`, margin, yPos)
    if (item.totalArea) {
      pdf.text(`面積: ${Math.round(item.totalArea / 100)} cm²`, margin + 80, yPos)
    }
    pdf.text(`¥${item.totalCost.toLocaleString()}`, margin + 140, yPos)
    yPos += 10

    if (yPos > pageHeight - margin) {
      pdf.addPage()
      yPos = margin + 10
    }
  })

  yPos += 10
  pdf.setFontSize(14)
  pdf.text(`合計金額: ¥${design.priceJPY.toLocaleString()} （税込想定）`, margin, yPos)

  // ダウンロード
  pdf.save(`${design.title || 'design'}.pdf`)
}
