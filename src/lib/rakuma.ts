import { Page } from 'puppeteer'
import sleep from 'util/sleep'
import { load } from 'cheerio'
import RowTitle from 'interface/RowTitle'
import path from 'path'
import { ScrapedDetail } from 'interface/Detail'

export const fetchRakuma = async (page: Page, data: Record<RowTitle, string>): Promise<ScrapedDetail[]> => {
  const url = `https://fril.jp/s?query=${data.ブランド名}%20${data.型番}&sort=created_at&transaction=selling`
  console.log(url)
  await page.goto(url)
  await page.waitForSelector('.view_grid')
  await page.waitForSelector('li')
  await sleep(5000)
  const html = await page.$eval('.view_grid', (elem) => elem.innerHTML)
  const $ = load(html)
  const list = $('.item').map((_, el) => $(el)).toArray()

  const details = list.map((listElement) => {
    const priceData = $(listElement).find('.price-status__price').text().replace(/\n/g, '').trim()
    const price = Number(priceData.replace(/[¥,]/g, ''))
    const url = $(listElement).find('a').attr()?.href
    return url && !~url.indexOf('https://s-evt.rmp.rakuten.co.jp') && {
      url,
      price,
      source: 'rakuma'
  }}).filter(v => v)

  return details
}



