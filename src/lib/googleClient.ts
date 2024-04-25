import { auth } from 'google-auth-library'
import keys from '../../ma-gpt-e43ec17911fa.json'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import RowTitle from 'interface/RowTitle'
import sleep from 'util/sleep'

export class GoogleClient {

  private id: string
  private spleadSheet: GoogleSpreadsheet

  constructor (id: string) {
    this.id = id
    const client = auth.fromJSON(keys)
    client.scopes = ['https://www.googleapis.com/auth/spreadsheets']
    this.spleadSheet = new GoogleSpreadsheet(id, client)
  }

  public async update (params: Record<string, string>, sheetIndex = 0): Promise<void> {
    await this.spleadSheet.loadInfo()
    const sheet = this.spleadSheet.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows()
    const target = rows.find(((row) => row.get('id') === params.id))
    target.assign(params)
    await target.save()
  }

  public async get <T extends string>(sheetIndex = 0): Promise<Record<T, string>[]> {
    await this.spleadSheet.loadInfo()
    const sheet = this.spleadSheet.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows()
    return rows.map(row => row.toObject()) as Record<T, string>[]
  }

  public async post (param: Record<string, string>,sheetIndex = 0): Promise<void> {
    await this.spleadSheet.loadInfo()
    const sheet = this.spleadSheet.sheetsByIndex[sheetIndex]
    await sheet.addRow(param, { maxContentLength: -1 })
  }

  public async postAll(params: Record<string, string>[],sheetIndex = 0): Promise<void> {
    for (const param of params) {
      await this.post(param, sheetIndex)
      await sleep(200)
    }
  }

  public async postOrUpdateAll(params: Record<string, string>[], sheetIndex = 0): promise<void> {
    await this.spleadSheet.loadInfo()
    const sheet = this.spleadSheet.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows()
    for (const param of params) {
      const target = rows.find(((row) => row.get('id') === param.id))
      if (!target) {
        await this.post(param)
        continue
      }
      target.assign(params)
      await target.save()  
    }
  }
}
