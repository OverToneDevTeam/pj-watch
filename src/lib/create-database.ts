import { Page } from 'puppeteer'
import sleep from 'util/sleep'
import { load } from 'cheerio'
import RowTitle from 'interface/RowTitle'
import path from 'path'
import { Detail } from 'interface/Detail'
import { scrollPageToBottom } from 'puppeteer-autoscroll-down'
import { GoogleClient } from 'lib/googleClient'
import CsvFile from '@mskii/csv-file'

export const buildDatabase = async (page: Page, csv: CsvFile): Promise<void> => {
  await login(page)
  const pages: number[] = [...Array(1000)].map((v, i)=> i + 2756)
  const buildUrl = (pageNumber: number) => `https://mypage.jwa1.jp/?page=${pageNumber}`
  for (const pageNumber of pages) {
    const url = buildUrl(pageNumber)
    await page.goto(url)
    await sleep(2000)
    console.log(url)
    const details = await getDetails(page, pageNumber)
    const data = details.filter(({ model, price }) => model && price)
    if (data.length) csv.append(data)
  }
  console.log('おわったよ')
}

const login = async (page: Page) => {
  // ログイン処理
  const loginUrl = 'https://mypage.jwa1.jp/login'
  const pass = 'FKSHR5AT'
  const mail = 'hyakki.inc@gmail.com'
  await page.goto(loginUrl)
  await page.type('[type=text]',mail)
  await page.type('[type=password]',pass)
  await page.click('[type=submit]')

  await page.waitForSelector('.st-lists')
  await sleep(5000)

  // 時計に絞る
  await page.click('[name=is_category][value="1"] + span')
  await page.click('.st-button.gray')
  await sleep(5000)
  await page.waitForSelector('.st-lists')
  const dirname = path.join(__dirname, '../img')
  const pat = path.join(dirname, 'fuga.png')
  await page.screenshot({path: pat})
}

const getDetails = async(page: Page, pageNumber: number): Promise<Detail[]> => {
  const lastPosition = await scrollPageToBottom(page, {
    size: 400,
    delay: 250,
    stepsLimit: 50
  })
  const dirname = path.join(__dirname, '../img')
  const pat = path.join(dirname, 'fuga2.png')
  await page.screenshot({path: pat})

  const html = await page.$eval('.st-lists', (elem) => elem.innerHTML)
  const $ = load(html)
  const list = $('.st-item').map((_, el) => $(el)).toArray()

  const detail: Detail[] = list.map((listElement) => {
    
    const priceText = $(listElement).find('.st-define__top').text().trim()
    const price = ~priceText.indexOf('¥') ? priceText.split('¥')[1].trim() : null
    const bidDate = $(listElement).find('time').text().trim()
    const lot = $(listElement).find('h3').text().trim()
    const defines = $(listElement).find('.st-info__define').find('dl').map((_, el) => {
      const title = $(el).find('dt').text()
      const value = $(el).find('dd').text()
      return {
        title,
        value
      }
    }).toArray()

    const brand = defines.find(({ title }) => title === 'ブランド').value
    const model = defines.find(({ title }) => title === '型番').value
    const accessories = defines.find(({ title }) => title === '付属品').value.split('　').join(',')

    return {
      brand,
      model,
      accessories,
      price,
      bidDate,
      lot,
      page: `${pageNumber}`
    }
  })
  return detail
}
