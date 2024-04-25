import { Page } from 'puppeteer'
import sleep from 'util/sleep'
import { load } from 'cheerio'
import RowTitle from 'interface/RowTitle'
import { ScrapedDetail } from 'interface/Detail'
import path from 'path'


export const fetchMercari = async (page: Page, data: Record<RowTitle, string>): Promise<ScrapedDetail[]> => {

  const url = `https://jp.mercari.com/search?keyword=${data.ブランド名}%20${data.型番}&status=on_sale&sort=created_time&order=desc`
  await page.goto(url)
  await page.waitForSelector('#item-grid')
  await page.waitForSelector('li')
  await sleep(5000)
  const html = await page.$eval('#item-grid', (elem) => elem.innerHTML)
  const $ = load(html)
  const list = $('li').map((_, el) => $(el)).toArray()

  const details = list.map((listElement) => {
    const url = $(listElement).find('a').attr()?.href
    const priceData = $(listElement).find('.merPrice').text()
    const price = Number(priceData.replace(/[¥,]/g, ''))
    return url && {
      url: `https://jp.mercari.com${url}`,
      price,
      source: 'merkari'
  }}).filter(v => v)

  return details
}