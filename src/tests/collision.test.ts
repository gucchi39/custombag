import { describe, it, expect } from 'vitest'
import { isOverlap, isInSeamArea, fitCheck } from '@/modules/collision/detector'
import { DesignElement } from '@/types/design'

describe('Collision Detector', () => {
  const element1: DesignElement = {
    id: 'elem-1',
    type: 'window',
    xMM: 50,
    yMM: 50,
    wMM: 100,
    hMM: 100,
    zIndex: 1,
    props: {},
  }

  const element2: DesignElement = {
    id: 'elem-2',
    type: 'window',
    xMM: 100,
    yMM: 100,
    wMM: 100,
    hMM: 100,
    zIndex: 2,
    props: {},
  }

  it('should detect overlap', () => {
    expect(isOverlap(element1, element2, 0)).toBe(true)
  })

  it('should detect non-overlap', () => {
    const farElement: DesignElement = {
      ...element2,
      xMM: 200,
      yMM: 200,
    }
    expect(isOverlap(element1, farElement, 0)).toBe(false)
  })

  it('should detect seam area invasion', () => {
    const nearEdgeElement: DesignElement = {
      ...element1,
      xMM: 5,
      yMM: 5,
    }
    expect(isInSeamArea(nearEdgeElement, 400, 400, 10)).toBe(true)
  })

  it('should allow elements in safe area', () => {
    const safeElement: DesignElement = {
      ...element1,
      xMM: 50,
      yMM: 50,
    }
    expect(isInSeamArea(safeElement, 400, 400, 10)).toBe(false)
  })

  it('should check fit correctly', () => {
    const container = { x: 0, y: 0, width: 200, height: 200 }
    expect(fitCheck(container, 150, 150)).toBe(true)
    expect(fitCheck(container, 250, 150)).toBe(false)
  })
})
