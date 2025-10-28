import { describe, it, expect } from 'vitest'
import { packBadges } from '@/modules/pack/badgePacker'

describe('Badge Packer', () => {
  it('should pack 57mm badges in a 200x200 area', () => {
    const positions = packBadges(200, 200, 57, 10)
    
    expect(positions.length).toBeGreaterThan(0)
    
    // すべてのバッジが範囲内にあることを確認
    positions.forEach(pos => {
      expect(pos.x - 57 / 2).toBeGreaterThanOrEqual(0)
      expect(pos.x + 57 / 2).toBeLessThanOrEqual(200)
      expect(pos.y - 57 / 2).toBeGreaterThanOrEqual(0)
      expect(pos.y + 57 / 2).toBeLessThanOrEqual(200)
    })
  })

  it('should pack 75mm badges with proper spacing', () => {
    const positions = packBadges(300, 300, 75, 15)
    
    expect(positions.length).toBeGreaterThan(0)
    
    // 格子状に配置されていることを確認（近似チェック）
    if (positions.length >= 4) {
      const pitch = 75 + 15
      const firstRow = positions.filter((_, i) => i < 3)
      
      // X座標の差がpitchに近いことを確認
      if (firstRow.length >= 2) {
        const dx = Math.abs(firstRow[1].x - firstRow[0].x)
        expect(dx).toBeCloseTo(pitch, 0)
      }
    }
  })

  it('should return empty array for too small area', () => {
    const positions = packBadges(50, 50, 75, 10)
    
    // 57mm + ギャップが入らない場合は空配列
    expect(positions.length).toBe(0)
  })
})
