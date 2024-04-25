import { GoogleClient } from 'lib/googleClient'
import { config } from 'dotenv'
import puppeteer from 'puppeteer'
import { test, buildDatabase } from 'lib/create-database'
import CsvFile from '@mskii/csv-file'

async function main () {
  const id = process.env.SPLEADSHEET_ID
  const sheet = new GoogleClient(id)

//  test(sheet)
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    ],
  })

  const page = await browser.newPage()

  await page.setViewport({ 
    width: 1024,
    height: 768,
    deviceScaleFactor: 2,
  })

  const result = new CsvFile({
    headers:['brand','model','price','bidDate','accessories','lot','page'],
    path: 'result.csv'
  })

  await buildDatabase(page, result)
}

try {
  config()
  main()

} catch (e) {
  console.log('ばかちん')
}