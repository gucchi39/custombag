/**
 * 矩形内に缶バッジを等間隔格子で配置
 */
export interface BadgePosition {
  x: number
  y: number
}

export function packBadges(
  rectWidth: number,
  rectHeight: number,
  diameterMM: number,
  gapMM: number
): BadgePosition[] {
  const positions: BadgePosition[] = []
  const radiusMM = diameterMM / 2
  const pitchMM = diameterMM + gapMM // 中心間距離

  // 最初のバッジの中心位置（左上から半径+ギャップ/2の位置）
  const startX = radiusMM + gapMM / 2
  const startY = radiusMM + gapMM / 2

  // 何列・何行入るか計算
  const cols = Math.floor((rectWidth - gapMM) / pitchMM)
  const rows = Math.floor((rectHeight - gapMM) / pitchMM)

  // 格子状に配置
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * pitchMM
      const y = startY + row * pitchMM

      // 矩形内に収まるかチェック
      if (
        x - radiusMM >= 0 &&
        x + radiusMM <= rectWidth &&
        y - radiusMM >= 0 &&
        y + radiusMM <= rectHeight
      ) {
        positions.push({ x, y })
      }
    }
  }

  return positions
}
