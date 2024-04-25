import { GoogleClient } from 'lib/googleClient'
import { config } from 'dotenv'
import puppeteer from 'puppeteer'
import { data } from 'cheerio/lib/api/attributes'
import { encodeBase64 } from 'util/base64'
import CsvFile from '@mskii/csv-file'
type DBRowTitle = 'brand' |	'model' |	'price' |	'bidDate' |	'accessories' |	'lot'
type MarketPrice = 'id' | 'ブランド名' | '型番' | '箱' | '保証書' | 'コマ' | '相場'

const testData = [
  {
    brand: 'ロレックス',
    model: '79174',
    price: '420,000',
    bidDate: '2024-03-10',
    accessories: 'ケース,保,',
    lot: 'Lot. 1-1',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '69173',
    price: '440,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,4コマ',
    lot: 'Lot. 1-2',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '78240',
    price: '538,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 1-3',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '15210',
    price: '402,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 1-4',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16200',
    price: '670,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 1-5',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16234',
    price: '475,000',
    bidDate: '2024-03-10',
    accessories: 'ケース,保,',
    lot: 'Lot. 1-6',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16234',
    price: '680,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,1コマ',
    lot: 'Lot. 1-7',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16233',
    price: '608,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 1-8',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '114270',
    price: '500,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 1-9',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16570',
    price: '805,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,サ保,1コマ',
    lot: 'Lot. 1-10',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16570',
    price: '830,000',
    bidDate: '2024-03-10',
    accessories: '箱,サ保,1コマ',
    lot: 'Lot. 2-1',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '14060',
    price: '1,040,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 2-2',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '114270',
    price: '670,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,サ保,修理明細,1コマ',
    lot: 'Lot. 2-3',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '114270',
    price: '660,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,サ保,修理明細,1コマ',
    lot: 'Lot. 2-4',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16200',
    price: '585,000',
    bidDate: '2024-03-10',
    accessories: '箱,',
    lot: 'Lot. 2-5',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16233',
    price: '665,000',
    bidDate: '2024-03-10',
    accessories: 'ケース（枕欠）,サ保,修明,3コマ',
    lot: 'Lot. 2-6',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '69173',
    price: '405,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,1コマ',
    lot: 'Lot. 2-7',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '69173',
    price: '383,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 2-8',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '79174',
    price: '403,000',
    bidDate: '2024-03-10',
    accessories: '箱,',
    lot: 'Lot. 2-9',
    page: undefined
  },
  {
    brand: 'IWC',
    model: 'IW356518',
    price: '364,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 2-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '323.30.40.40.06.001',
    price: '220,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 3-1',
    page: undefined
  },
  {
    brand: 'ウブロ',
    model: '542.NX.1171.LR',
    price: '521,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 3-2',
    page: undefined
  },
  {
    brand: 'ウブロ',
    model: '301.SX.1170.RX',
    price: '650,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 3-3',
    page: undefined
  },
  {
    brand: 'モンブラン',
    model: '7444',
    price: '730,000',
    bidDate: '2024-03-10',
    accessories: '箱,',
    lot: 'Lot. 3-4',
    page: undefined
  },
  {
    brand: 'ゼニス',
    model: '03.2080.4021',
    price: '307,000',
    bidDate: '2024-03-10',
    accessories: '箱,',
    lot: 'Lot. 3-5',
    page: undefined
  },
  {
    brand: 'ゼニス',
    model: '03.2153.400',
    price: '555,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 3-6',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'AB0115',
    price: '360,000',
    bidDate: '2024-03-10',
    accessories: 'ケース,保,替えベルト,1コマ',
    lot: 'Lot. 3-7',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'AB0110',
    price: '321,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,1コマ',
    lot: 'Lot. 3-8',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16234',
    price: '617,000',
    bidDate: '2024-03-10',
    accessories: 'ケース枕欠',
    lot: 'Lot. 3-9',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '78240',
    price: '530,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 3-10',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116900',
    price: '953,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 4-1',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '124270',
    price: '1,000,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,3コマ',
    lot: 'Lot. 4-2',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '224270',
    price: '1,140,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 4-3',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116234',
    price: '1,000,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 4-4',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '124200',
    price: '676,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 4-5',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116300',
    price: '990,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 4-6',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '14060M',
    price: '1,120,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,1コマ',
    lot: 'Lot. 4-7',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16610',
    price: '892,000',
    bidDate: '2024-03-10',
    accessories: '箱,2コマ',
    lot: 'Lot. 4-8',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16610',
    price: '1,030,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 4-9',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '16700',
    price: '1,390,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 4-10',
    page: undefined
  },
  {
    brand: 'ウブロ',
    model: '301.TI.450.RX',
    price: '1,000,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 5-1',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116233',
    price: '1,150,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,2コマ',
    lot: 'Lot. 5-2',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116231G',
    price: '1,220,000',
    bidDate: '2024-03-10',
    accessories: '保,ケース',
    lot: 'Lot. 5-3',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '226570',
    price: '1,410,000',
    bidDate: '2024-03-10',
    accessories: '箱,保（2022/4）',
    lot: 'Lot. 5-4',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116600',
    price: '1,320,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,3コマ',
    lot: 'Lot. 5-5',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '126660',
    price: '1,620,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 5-6',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '178271NR',
    price: '1,480,000',
    bidDate: '2024-03-10',
    accessories: '箱,',
    lot: 'Lot. 5-7',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '126334',
    price: '1,660,000',
    bidDate: '2024-03-10',
    accessories: '箱,保（2022/3）,1コマ',
    lot: 'Lot. 5-8',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '118139',
    price: '2,480,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,',
    lot: 'Lot. 5-9',
    page: undefined
  },
  {
    brand: 'ロレックス',
    model: '116503G',
    price: '',
    bidDate: '2024-03-10',
    accessories: '箱,保（2022/3）,1コマ',
    lot: 'Lot. 5-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '227.90.55.21.04.001',
    price: '1,060,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,替えベルト(ブレスMx1 S×1ラバー）',
    lot: 'Lot. 6-1',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '212.32.41.20.04.001',
    price: '666,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,限定書,コマ5,純正NATOベルト,工具',
    lot: 'Lot. 6-2',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3570.5',
    price: '497,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ1',
    lot: 'Lot. 6-3',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.5',
    price: '271,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 6-4',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '326.30.40.50.01.001',
    price: '333,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 6-5',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3220.5',
    price: '267,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 6-6',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '231.10.39.21.01.002',
    price: '412,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 6-7',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '231.10.42.21.01.004',
    price: '440,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 6-8',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.52',
    price: '400,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 6-9',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.5',
    price: '261,000',
    bidDate: '2024-03-10',
    accessories: '保',
    lot: 'Lot. 6-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '215.33.46.51.03.001',
    price: '511,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 7-1',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '215.30.46.51.99.001',
    price: '650,000',
    bidDate: '2024-03-10',
    accessories: 'コマ5',
    lot: 'Lot. 7-2',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3570.5',
    price: '496,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 7-3',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '4532.41',
    price: '293,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 7-4',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3518.5',
    price: '419,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,限定書,コマ3',
    lot: 'Lot. 7-5',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.12',
    price: '344,000',
    bidDate: '2024-03-10',
    accessories: '保,コマ2',
    lot: 'Lot. 7-6',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.5',
    price: '272,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 7-7',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3210.5',
    price: '250,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 7-8',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3513.5',
    price: '175,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 7-9',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '2504.8',
    price: '278,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 7-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '2504.8',
    price: '278,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 7-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '232.90.44.22.03.001',
    price: '561,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ5',
    lot: 'Lot. 8-1',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '232.30.46.51.01.001',
    price: '533,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 8-2',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '231.10.39.21.01.002',
    price: '415,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 8-3',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3551.2',
    price: '493,000',
    bidDate: '2024-03-10',
    accessories: 'ケース,保,コマ3',
    lot: 'Lot. 8-4',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '326.30.40.50.06.001',
    price: '350,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 8-5',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3523.3',
    price: '215,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 8-6',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3570.5',
    price: '476,000',
    bidDate: '2024-03-10',
    accessories: '保',
    lot: 'Lot. 8-7',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3210.5',
    price: '240,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 8-8',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.5',
    price: '280,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 8-9',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '2531.8',
    price: '270,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 8-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '516.13.41.10.05.001',
    price: '220,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 9-1',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '422.13.41.52.06.001',
    price: '290,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 9-2',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '231.10.44.50.09.001',
    price: '387,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 9-3',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '522.30.41.20.01.001',
    price: '391,000',
    bidDate: '2024-03-10',
    accessories: 'コマ3',
    lot: 'Lot. 9-4',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '232.32.44.22.01.002',
    price: '420,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 9-5',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '233.30.41.21.01.001',
    price: '409,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ5',
    lot: 'Lot. 9-6',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3570.5',
    price: '497,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 9-7',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '326.30.40.50.01.001',
    price: '323,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 9-8',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3210.5',
    price: '223,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 9-9',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3510.5',
    price: '236,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ4',
    lot: 'Lot. 9-10',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3806.31.31',
    price: '480,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,オリジナルベルト',
    lot: 'Lot. 10-1',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3506.31',
    price: '543,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ5',
    lot: 'Lot. 10-2',
    page: undefined
  },
  {
    brand: 'オメガ',
    model: '3517.3',
    price: '394,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ2',
    lot: 'Lot. 10-3',
    page: undefined
  },
  {
    brand: 'IWC',
    model: 'IW387901',
    price: '563,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 10-4',
    page: undefined
  },
  {
    brand: 'IWC',
    model: 'IW371701',
    price: '398,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ3',
    lot: 'Lot. 10-5',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'A23311',
    price: '595,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 11-1',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'AB0138',
    price: '800,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,コマ5',
    lot: 'Lot. 11-2',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'AB0118',
    price: '410,000',
    bidDate: '2024-03-10',
    accessories: '箱,保',
    lot: 'Lot. 11-3',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'A38022',
    price: '380,000',
    bidDate: '2024-03-10',
    accessories: '箱,保,限定証',
    lot: 'Lot. 11-4',
    page: undefined
  },
  {
    brand: 'ブライトリング',
    model: 'B12019',
    price: '245,000',
    bidDate: '2024-03-10',
    accessories: '箱',
    lot: 'Lot. 11-5',
    page: undefined
}]


async function main () {
  const id = process.env.SPLEADSHEET_ID
  const sheet = new GoogleClient(id)
  const transactions: Record<DBRowTitle, string>[] = await sheet.get<DBRowTitle>(1)

  const result = new CsvFile({
    headers:['id','ブランド名','型番','箱アリ','保証書','コマ','相場'],
    path: 'target.csv'
  })

  const transactionData = transactions.filter(({price}) => price).map(({ brand, model, accessories, price }) => {
    return {
      brand,
      model,
      price: Number(price.replace(/,/g, '')),
      box: !!~accessories.indexOf('保'),
      warranty: !!~accessories.indexOf('箱') || !!~accessories.indexOf('ケース'),
      frame: !!~accessories.indexOf('コマ')
    }
//    keysMap.set(JSON.stringify(keyObject), keyObject)
  })

  // 重複なしのidのリスト
  const idDatas = transactionData.map(({price, ...info}) => {
    return encodeBase64(JSON.stringify(info))
  })
  const ids = Array.from(new Set(idDatas))

  const formattedData = ids.map((id) => {
    const transactions = transactionData.filter(({ price, ...info }) => encodeBase64(JSON.stringify(info)) === id)
    if (transactions.length < 3) return null
    const transactionInfos = transactions.map(({price, ...info}) => info)
    const transactionPrices = transactions.map(({price}) => price)
    const average = transactionPrices.reduce((prev, current) => {
      return prev + (current/transactionPrices.length)
    }, 0)

    return {
      'id': id,
      'ブランド名': transactionInfos[0].brand,
      '型番': transactionInfos[0].model,
      '箱アリ':transactionInfos[0].box ? '有' : '無',
      '保証書':transactionInfos[0].warranty ? '有' : '無',
      'コマ': transactionInfos[0].frame? '有' : '無',
      '相場': average.toString()
    }
  }).filter(v => v)
  await result.append(formattedData)//sheet.postOrUpdateAll(formattedData, 0)
}

async function test() {
  const maps = new Map()

/*  const keysData = testData.map(({ brand, model, accessories }) => {
    const keyObject = {
      keyString: `${brand},${model}`,
      box: !!~accessories.indexOf('保'),
      warranty: !!~accessories.indexOf('箱') || !!~accessories.indexOf('ケース'),
      frame: !!~accessories.indexOf('コマ')
    }
    return [`${keyObject.keyString}${keyObject.box}${keyObject.warranty}${keyObject.frame}`, keyObject ]
  })*/

  // 重複削除でkeyを作成
  console.log(testData.length)
  const keysData = testData.forEach(({ brand, model, accessories }) => {
    const keyObject = {
      brand,
      model,
      box: !!~accessories.indexOf('保'),
      warranty: !!~accessories.indexOf('箱') || !!~accessories.indexOf('ケース'),
      frame: !!~accessories.indexOf('コマ')
    }
    maps.set(encodeBase64(JSON.stringify(keyObject)), keyObject )
  })

  const keys = Array.from(maps).map((key) => key[1])
  console.log(keys)
  console.log(keys.length)
}

try {
  config()
  main()
//  test()
} catch (e) {
  console.log('ばかちん')
}

