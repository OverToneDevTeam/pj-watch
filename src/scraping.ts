//import chromium from '@sparticuz/chromium'
import { GoogleClient } from 'lib/googleClient'
import { config } from 'dotenv'
//import puppeteer from 'puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js'
import puppeteer from 'puppeteer'
import { fetchMercari } from 'lib/merkari'
import { fetchRakuma } from 'lib/rakuma'
import { buildMarketPrice } from 'util/marketPrice'
import CsvFile from '@mskii/csv-file'
import path from 'path'

async function main () {
  const id = process.env.SPLEADSHEET_ID
  const sheet = new GoogleClient(id)
  const datas = await sheet.get()

  const targets = datas.filter(({ 箱, 保証書, コマ, 相場 }) => 箱 === '無' && 保証書 === '無' && コマ === '無' && Number(相場) > 100000)
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    ],
  })

  const listTarget = new CsvFile({
    headers:['url'],
    path: 'targets.csv'
  })
  listTarget.append(targets)

  /*
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(
      path.join(__dirname, '../node_modules/@sparticuz/chromium/bin/')
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });*/

  const page = await browser.newPage()

  await page.setViewport({ 
    width: 1024,
    height: 768,
    deviceScaleFactor: 2,
  })

  const sended = new CsvFile({
    headers:['url'],
    path: 'sended.csv'
  })
  const hookUrl = 'https://open.larksuite.com/open-apis/bot/v2/hook/4a2ed290-ea8a-4d9d-b732-42f913d02041'

  let index = 0
  for (const target of targets) {
    if (index < 117) {
      index++
      continue
    }
    console.log(target)
    const detailsByMercari = await fetchMercari(page, target)
    const detailsByRakuma = await fetchRakuma(page, target)
    const details = [...detailsByMercari, ...detailsByRakuma]

    for (const detail of details) {
      const { marketPrice, minPrice } = buildMarketPrice(target)

      if (detail.price > marketPrice || detail.price < minPrice) continue
  
      const sendData = await sended.convertCsvToArray()
      if (sendData.find((data) => data[0] === detail.url)) continue
  
      const requestBody = {
        msg_type: "text",
        content: {text:`${target.ブランド名}/${target.型番}の新規出品がありました\n値段: ${detail.price}\n相場: ${target.相場}\nURL:${detail.url}`}
      }

      console.log(target)
  /*
      await fetch(hookUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      })*/
      sended.append([{ url : detail.url } ])
    }
  }
}

try {
  config()
  main()
} catch (e) {
  console.log('ばかちん')
}