import { test, expect } from '@playwright/test'

test.describe('OSHI BAG BUILDER E2E', () => {
  test('basic workflow: create, edit, save, and reload', async ({ page }) => {
    // ホームページに移動
    await page.goto('http://localhost:5173')
    
    // タイトルを確認
    await expect(page.locator('h1')).toContainText('推しが主役のバッグ')
    
    // カスタムを開始
    await page.click('text=カスタムをはじめる')
    await expect(page).toHaveURL(/.*design/)
    
    // 窓を追加
    await page.click('text=矩形窓')
    
    // 価格が更新されることを確認
    const priceElement = page.locator('text=/¥[0-9,]+/')
    await expect(priceElement).toBeVisible()
    
    // 保存
    await page.click('text=💾 保存')
    await expect(page.locator('text=デザインを保存しました')).toBeVisible({ timeout: 5000 })
    
    // ギャラリーに移動
    await page.click('text=ギャラリー')
    await expect(page).toHaveURL(/.*gallery/)
    
    // 保存されたデザインが表示されることを確認
    await expect(page.locator('text=新しいデザイン')).toBeVisible()
  })

  test('share code workflow', async ({ page }) => {
    await page.goto('http://localhost:5173/gallery')
    
    // Seedデザインの共有コードをコピー
    await page.locator('button[title="共有コードをコピー"]').first().click()
    
    // クリップボードから共有コードを取得
    const shareCode = await page.evaluate(() => navigator.clipboard.readText())
    expect(shareCode).toBeTruthy()
    
    // 共有コードを読み込み
    await page.fill('input[placeholder="共有コードを貼り付け..."]', shareCode)
    await page.click('text=読み込み')
    
    // エディタに移動することを確認
    await expect(page).toHaveURL(/.*design/)
  })

  test('export functions', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.click('text=カスタムをはじめる')
    
    // PNGエクスポート（ダウンロード開始を確認）
    const [download1] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=PNG'),
    ])
    expect(download1.suggestedFilename()).toMatch(/\.png$/)
    
    // JSONエクスポート
    const [download2] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=JSON'),
    ])
    expect(download2.suggestedFilename()).toMatch(/\.json$/)
  })
})
