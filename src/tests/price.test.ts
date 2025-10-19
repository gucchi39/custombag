import { describe, it, expect } from 'vitest'
import { calcPrice, generateBOM } from '@/modules/price/calculator'
import { Design } from '@/types/design'
import { PRICING_RATES } from '@/config/pricing'

describe('Price Calculator', () => {
  const mockDesign: Design = {
    id: 'test-1',
    title: 'Test Design',
    bagType: 'tote',
    color: '#FFFFFF',
    widthMM: 350,
    heightMM: 400,
    seamMM: 10,
    elements: [
      {
        id: 'elem-1',
        type: 'window',
        xMM: 50,
        yMM: 50,
        wMM: 150,
        hMM: 150,
        zIndex: 1,
        props: { shape: 'rectangle' },
      },
      {
        id: 'elem-2',
        type: 'hardware',
        xMM: 20,
        yMM: 20,
        wMM: 20,
        hMM: 20,
        zIndex: 2,
        props: { hardwareType: 'd-ring' },
      },
    ],
    priceJPY: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  it('should calculate base price correctly', () => {
    const emptyDesign = { ...mockDesign, elements: [] }
    const price = calcPrice(emptyDesign, PRICING_RATES)
    
    const expectedBagArea = 350 * 400
    const expectedPrice = PRICING_RATES.baseBagCost + expectedBagArea * PRICING_RATES.materialRatePerMM2
    
    expect(price).toBe(Math.round(expectedPrice))
  })

  it('should include element costs', () => {
    const price = calcPrice(mockDesign, PRICING_RATES)
    
    const bagArea = 350 * 400
    const baseCost = PRICING_RATES.baseBagCost + bagArea * PRICING_RATES.materialRatePerMM2
    const windowCost = PRICING_RATES.complexityFactorPerElement
    const hardwareCost = PRICING_RATES.hardwareRatePerPoint
    
    const expectedPrice = baseCost + windowCost + hardwareCost
    
    expect(price).toBe(Math.round(expectedPrice))
  })

  it('should generate BOM correctly', () => {
    const bom = generateBOM(mockDesign, PRICING_RATES)
    
    expect(bom).toHaveLength(3) // バッグ本体 + 窓 + 金具
    expect(bom[0].type).toBe('バッグ本体')
    expect(bom[0].count).toBe(1)
  })
})
